
import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCards } from "@/context/CardContext";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  cardName: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters")
    .refine(val => /^[a-zA-Z\s]+$/.test(val), {
      message: "Card name can only contain letters and spaces"
    })
});

interface AddCardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddCardModal: React.FC<AddCardModalProps> = ({ open, onOpenChange }) => {
  const { addCard, isAddCardLoading } = useCards();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cardName: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    addCard(values.cardName.trim());
    toast.success("New card added successfully");
    form.reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      // Only allow closing if we're not in the middle of adding a card
      if (!isAddCardLoading || !isOpen) {
        onOpenChange(isOpen);
      }
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Card</DialogTitle>
          <DialogDescription>
            Enter the name to appear on your new virtual debit card.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="cardName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name on Card</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your name" 
                      autoComplete="off"
                      disabled={isAddCardLoading}
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    This name will appear on your virtual card.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isAddCardLoading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-aspire-green hover:bg-aspire-green/90"
                disabled={isAddCardLoading}
              >
                {isAddCardLoading ? "Adding..." : "Add Card"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCardModal;
