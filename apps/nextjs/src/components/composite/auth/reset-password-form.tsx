"use client";

import { useAction } from "next-safe-action/hooks";

import type { ResetPassword } from "@no-stack/validators";
import { ResetPasswordSchema } from "@no-stack/validators";

import { resetPassword } from "~/app/auth/actions";
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

export const ResetPasswordForm = () => {
  const form = useForm({
    schema: ResetPasswordSchema,
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const { execute, result, status } = useAction(resetPassword);

  const onSubmit = (values: ResetPassword) => {
    execute(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={status === "executing"}
                    placeholder="******"
                    type="password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={status === "executing"}
                    placeholder="******"
                    type="password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormError message={result.serverError} />
        {status === "hasSucceeded" && (
          <FormSuccess message={"Password has been reset successfully!"} />
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
