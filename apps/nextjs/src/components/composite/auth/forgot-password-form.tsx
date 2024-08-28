"use client";

import Link from "next/link";
import { useAction } from "next-safe-action/hooks";
import { z } from "zod";

import { forgotPassword } from "~/app/auth/actions";
import { FormError } from "@/components/composite/auth/form-error";
import { FormSuccess } from "@/components/composite/auth/form-success";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const ForgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotPasswordType = z.infer<typeof ForgotPasswordSchema>;

export const ForgotPasswordForm = () => {
  const form = useForm({
    schema: ForgotPasswordSchema,
    defaultValues: {
      email: "",
    },
  });

  const { execute, result, status } = useAction(forgotPassword);

  const onSubmit = (values: ForgotPasswordType) => {
    execute(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email address</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={status === "executing"}
                    placeholder="Email address"
                    type="email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormError message={result.serverError} />
        {status === "hasSucceeded" && (
          <FormSuccess message={"Reset email has been sent!"} />
        )}

        <div className="flex flex-col gap-4">
          <Button
            disabled={status === "executing"}
            type="submit"
            className="w-full"
          >
            Reset Password
          </Button>
        </div>
      </form>
    </Form>
  );
};
