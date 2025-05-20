import { useEffect, useState } from "react";
import { NavbarManager } from "@/components/NavbarManager";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import {
  addPaymentMethod,
  deletePAymentMethod,
  getPaymentMethods,
  updatePaymentMethod,
} from "@/ApiRequuests/PaymentMethodRequest";

// Define payment method types
type PaymentMethodType = "bank" | "upi" | "wallet";

// Define payment method interface
interface PaymentMethod {
  _id: string;
  methodType: PaymentMethodType;
  name: string;
  accountHolderName?: string;
  bankDetails: {
    accountNumber?: string;
    ifscCode?: string;
    // upiId?: string;
    walletId?: string;
  };
  upiId?: string;
  isDefault: boolean;
}

const formSchema = z.object({
  _id: z.string().optional(),
  methodType: z.enum(["bank", "upi", "wallet"]),
  name: z.string().min(1, "Name is required"),
  accountNumber: z.string().optional(),
  accountHolderName: z.string().optional(),
  ifscCode: z.string().optional(),
  upiId: z.string().optional(),
  walletId: z.string().optional(),
  isDefault: z.boolean().default(false),
});

const PaymentMethodsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentPaymentMethod, setCurrentPaymentMethod] =
    useState<PaymentMethod | null>(null);
  const [loading, setLoading] = useState(false);
  const [isActionLoading, setisActionLoading] = useState(false);

  const FetchPaymentMethods = async () => {
    try {
      setLoading(true);
      const response = await getPaymentMethods();
      if (response.data?.success) {
        setPaymentMethods(response?.data?.result);
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    FetchPaymentMethods();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      _id: undefined,
      methodType: "bank",
      name: "",
      accountNumber: "",
      accountHolderName: "",
      ifscCode: "",
      upiId: "",
      walletId: "",
      isDefault: false,
    },
  });

  const openAddDialog = () => {
    form.reset({
      _id: undefined,
      methodType: "bank",
      name: "",
      accountNumber: "",
      accountHolderName: "",
      ifscCode: "",
      upiId: "",
      walletId: "",
      isDefault: false,
    });
    setIsAddDialogOpen(true);
  };

  const openEditDialog = (method: PaymentMethod) => {
    setCurrentPaymentMethod(method);
    form.reset({
      _id: method?._id,
      methodType: method?.methodType,
      name: method?.name,
      accountNumber: method?.bankDetails?.accountNumber || "",
      accountHolderName: method?.accountHolderName || "",
      ifscCode: method?.bankDetails?.ifscCode || "",
      upiId: method.upiId || "",
      // walletId: method?.bankDetails?.walletId || "",
      isDefault: method?.isDefault,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (method: PaymentMethod) => {
    setCurrentPaymentMethod(method);
    setIsDeleteDialogOpen(true);
  };

  const handleAddPaymentMethod = async (values: z.infer<typeof formSchema>) => {
    try {
      setisActionLoading(true);
      const newPaymentMethod = {
        methodType: values.methodType,
        name: values.name,
        accountHolderName: values?.accountHolderName,
        ...(values.methodType === "bank" && {
          bankDetails: {
            accountNumber: values.accountNumber,
            ifscCode: values.ifscCode,
          },
        }),
        ...(values.methodType === "upi" && {
          upiId: values.upiId,
        }),

        isDefault: values.isDefault,
      };

      if (values.isDefault) {
        // Update other payment methods to not be default
        setPaymentMethods((prevMethods) =>
          prevMethods.map((method) => ({
            ...method,
            isDefault: false,
          }))
        );
      }

      const response = !values?._id
        ? await addPaymentMethod(newPaymentMethod)
        : await updatePaymentMethod(values?._id, newPaymentMethod);
      if (response.data.success) {
        setIsAddDialogOpen(false);
        setIsEditDialogOpen(false);
        toast({
          title: "Success",
          description: "Payment method added successfully!",
        });
        await FetchPaymentMethods();
      }
    } catch (err) {
    } finally {
      setisActionLoading(false);
    }
  };

  const handleEditPaymentMethod = (values: z.infer<typeof formSchema>) => {
    if (!currentPaymentMethod) return;

    const updatedMethods = paymentMethods.map((method) => {
      if (method._id === currentPaymentMethod._id) {
        return {
          ...method,
          methodType: values.methodType,
          name: values.name,
          bankDetails: {
            ...(values.methodType === "bank" && {
              accountNumber: values.accountNumber,
              accountHolderName: values?.accountHolderName,
              ifscCode: values.ifscCode,
            }),
            ...(values.methodType === "upi" && {
              upiId: values.upiId,
            }),
            // ...(values.type === "wallet" && {
            //   walletId: values.walletId,
            // }),
          },
          isDefault: values.isDefault,
        };
      }

      // If this method is not being edited but the edited one is set as default,
      // ensure this method is not default
      if (values.isDefault && method._id !== currentPaymentMethod._id) {
        return {
          ...method,
          isDefault: false,
        };
      }

      return method;
    });

    setPaymentMethods(updatedMethods);
    setIsEditDialogOpen(false);
    toast({
      title: "Success",
      description: "Payment method updated successfully!",
    });
  };

  const handleDeletePaymentMethod = () => {
    try {
      const response = deletePAymentMethod(currentPaymentMethod._id);
      if (response) {
        setIsDeleteDialogOpen(false);
        toast({
          title: "Success",
          description: "Payment method removed successfully!",
        });
      } else {
        // toast({
        //   title: "Success",
        //   description: "Payment method removed successfully!",
        //   type:'destructive'
        // });
      }
    } catch (err) {
    } finally {
    }
  };

  const getPaymentMethodIcon = (methodType: PaymentMethodType) => {
    switch (methodType) {
      case "bank":
        return (
          <div className="h-10 w-10 bg-blue-100 text-blue-700 flex items-center justify-center rounded">
            B
          </div>
        );
      case "upi":
        return (
          <div className="h-10 w-10 bg-green-100 text-green-700 flex items-center justify-center rounded">
            U
          </div>
        );
      case "wallet":
        return (
          <div className="h-10 w-10 bg-purple-100 text-purple-700 flex items-center justify-center rounded">
            W
          </div>
        );
    }
  };

  const getPaymentMethodbankDetails = (method: PaymentMethod) => {
    switch (method.methodType) {
      case "bank":
        return `${method.bankDetails.accountNumber || ""} • ${
          method.bankDetails.ifscCode || ""
        } • ${method?.accountHolderName}`;
      case "upi":
        return method?.upiId || "";
      case "wallet":
        return method.bankDetails.walletId || "";
    }
  };

  const renderFormFieldsForType = (methodType: PaymentMethodType) => {
    switch (methodType) {
      case "bank":
        return (
          <>
            <FormField
              control={form.control}
              name="accountNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter account number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ifscCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IFSC Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter IFSC code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );
      case "upi":
        return (
          <FormField
            control={form.control}
            name="upiId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>UPI ID</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter UPI ID (e.g. name@upi)"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
      // case "wallet":
      //   return (
      //     <FormField
      //       control={form.control}
      //       name="walletId"
      //       render={({ field }) => (
      //         <FormItem>
      //           <FormLabel>Wallet ID/Phone Number</FormLabel>
      //           <FormControl>
      //             <Input
      //               placeholder="Enter wallet ID or phone number"
      //               {...field}
      //             />
      //           </FormControl>
      //           <FormMessage />
      //         </FormItem>
      //       )}
      //     />
      //   );
    }
  };

  if (!user) {
    return null; // Protected route will handle this
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavbarManager />

      <main className="flex-grow py-10 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold">Payment Methods</h1>
                <p className="text-gray-600">
                  Manage your withdrawal options here
                </p>
              </div>
              <Button
                onClick={openAddDialog}
                className="bg-crypto-blue hover:bg-crypto-ocean"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Method
              </Button>
            </div>

            {loading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
              </div>
            ) : paymentMethods.length === 0 ? (
              <Card className="text-center p-8">
                <div className="mb-4 text-gray-400">
                  <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                    <i className="text-2xl">💳</i>
                  </div>
                </div>
                <h3 className="text-lg font-medium">No Payment Methods Yet</h3>
                <p className="text-gray-600 mb-4">
                  Add a payment method to receive funds from exchanges and
                  transactions.
                </p>
                <Button
                  onClick={openAddDialog}
                  className="bg-crypto-blue hover:bg-crypto-ocean"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Method
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {paymentMethods.map((method) => (
                  <Card
                    key={method._id}
                    className="border border-gray-200 shadow-sm"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {getPaymentMethodIcon(method.methodType)}
                          <div className="ml-4">
                            <div className="flex items-center">
                              <h3 className="font-medium text-lg">
                                {method.name}
                              </h3>
                              {method.isDefault && (
                                <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                  Default
                                </span>
                              )}
                            </div>
                            <div className="text-gray-500 text-sm mt-1">
                              <span className="capitalize">
                                {method.methodType}
                              </span>
                              <span className="mx-1">•</span>
                              <span>{getPaymentMethodbankDetails(method)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(method)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDeleteDialog(method)}
                            className="text-red-500 border-red-200 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Add Payment Method Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Payment Method</DialogTitle>
            <DialogDescription>
              Add a new payment method to receive funds.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleAddPaymentMethod)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="methodType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Method Type</FormLabel>
                    <FormControl>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          // Reset related fields when changing type
                          if (e.target.value === "bank") {
                            form.setValue("upiId", "");
                            form.setValue("walletId", "");
                          } else if (e.target.value === "upi") {
                            form.setValue("accountNumber", "");
                            form.setValue("ifscCode", "");
                            form.setValue("walletId", "");
                          } else if (e.target.value === "wallet") {
                            form.setValue("accountNumber", "");
                            form.setValue("ifscCode", "");
                            form.setValue("upiId", "");
                          }
                        }}
                      >
                        <option value="bank">Bank Account</option>
                        <option value="upi">UPI</option>
                        {/* <option value="wallet">E-Wallet</option> */}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter a name for this method"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="accountHolderName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Holder Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter account holder name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Dynamic fields based on payment type */}
              {renderFormFieldsForType(
                form.watch("methodType") as PaymentMethodType
              )}

              <FormField
                control={form.control}
                name="isDefault"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="h-4 w-4 rounded border-gray-300 text-crypto-blue focus:ring-crypto-blue"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Set as default payment method</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    disabled={isActionLoading}
                    type="button"
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  disabled={isActionLoading}
                  className="bg-crypto-blue hover:bg-crypto-ocean"
                >
                  {isActionLoading ? "Submitting..." : "Add Method"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Payment Method Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Payment Method</DialogTitle>
            <DialogDescription>
              Update your payment method bankDetails.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleAddPaymentMethod)}
              className="space-y-4"
            >
              {/* Same form fields as Add Dialog */}
              <FormField
                control={form.control}
                name="methodType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Method Type</FormLabel>
                    <FormControl>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          // Reset related fields when changing type
                          if (e.target.value === "bank") {
                            form.setValue("upiId", "");
                            form.setValue("walletId", "");
                          } else if (e.target.value === "upi") {
                            form.setValue("accountNumber", "");
                            form.setValue("ifscCode", "");
                            form.setValue("walletId", "");
                          } else if (e.target.value === "wallet") {
                            form.setValue("accountNumber", "");
                            form.setValue("ifscCode", "");
                            form.setValue("upiId", "");
                          }
                        }}
                      >
                        <option value="bank">Bank Account</option>
                        <option value="upi">UPI</option>
                        {/* <option value="wallet">E-Wallet</option> */}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter a name for this method"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Dynamic fields based on payment type */}
              {renderFormFieldsForType(
                form.watch("methodType") as PaymentMethodType
              )}

              <FormField
                control={form.control}
                name="isDefault"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="h-4 w-4 rounded border-gray-300 text-crypto-blue focus:ring-crypto-blue"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Set as default payment method</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    disabled={isActionLoading}
                    type="button"
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  disabled={isActionLoading}
                  className="bg-crypto-blue hover:bg-crypto-ocean"
                >
                  {isActionLoading ? "Updating..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Payment Method</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this payment method?
              {currentPaymentMethod?.isDefault && (
                <p className="mt-2 text-amber-600 font-semibold">
                  This is your default payment method. If removed, another
                  method will be set as default.
                </p>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2 justify-end">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={handleDeletePaymentMethod}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default PaymentMethodsPage;
