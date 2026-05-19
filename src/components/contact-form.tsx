"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const schema = z.object({
  name: z.string().min(1, "Required"),
  email: z.string().email("Enter a valid email"),
  role: z.string().optional(),
  reason: z.string().optional(),
  message: z.string().min(1, "Required"),
});

type FormValues = z.infer<typeof schema>;

type SubmissionState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success" }
  | { status: "error"; message: string };

export function ContactForm() {
  const [state, setState] = useState<SubmissionState>({ status: "idle" });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      role: "",
      reason: "",
      message: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setState({ status: "submitting" });
    // Phase 4 wires this to /api/contact backed by Supabase + Resend.
    // For now we simulate a successful submission so the UI can be reviewed.
    await new Promise((resolve) => setTimeout(resolve, 600));
    if (process.env.NODE_ENV === "development") {
      console.log("[contact:phase-3 placeholder]", values);
    }
    setState({ status: "success" });
    reset();
  });

  if (state.status === "success") {
    return (
      <div className="rounded-2xl border border-primary/40 bg-primary/5 p-8 text-center md:text-left">
        <h3 className="font-serif text-2xl font-light tracking-tight">
          Thanks — message received.
        </h3>
        <p className="mt-2 text-base text-muted-foreground">
          (Form is in skeleton mode until Phase 4 wires the backend. Real
          delivery via Resend lands in the next phase.)
        </p>
        <Button
          variant="ghost"
          className="mt-4"
          onClick={() => setState({ status: "idle" })}
        >
          Send another
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field
          id="name"
          label="Name"
          required
          error={errors.name?.message}
          inputProps={register("name")}
        />
        <Field
          id="email"
          label="Email"
          required
          type="email"
          error={errors.email?.message}
          inputProps={register("email")}
        />
        <Field
          id="role"
          label="Role"
          error={errors.role?.message}
          inputProps={register("role")}
          hint="Optional — e.g. recruiter, founder, classmate"
        />
        <Field
          id="reason"
          label="Reason"
          error={errors.reason?.message}
          inputProps={register("reason")}
          hint="Optional — what's prompting the reach-out"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="message" className="text-sm">
          Message <span className="text-primary">*</span>
        </Label>
        <Textarea
          id="message"
          rows={5}
          aria-invalid={Boolean(errors.message)}
          {...register("message")}
        />
        {errors.message ? (
          <p className="text-xs text-destructive">{errors.message.message}</p>
        ) : null}
      </div>

      <Button
        type="submit"
        size="lg"
        className="self-center rounded-full px-7 md:self-start"
        disabled={state.status === "submitting"}
      >
        {state.status === "submitting" ? "Sending…" : "Send message"}
      </Button>

      {state.status === "error" ? (
        <p className="text-sm text-destructive">{state.message}</p>
      ) : null}
    </form>
  );
}

type FieldProps = {
  id: string;
  label: string;
  required?: boolean;
  type?: string;
  hint?: string;
  error?: string;
  inputProps: ReturnType<ReturnType<typeof useForm<FormValues>>["register"]>;
};

function Field({
  id,
  label,
  required,
  type = "text",
  hint,
  error,
  inputProps,
}: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id} className="text-sm">
        {label}
        {required ? <span className="text-primary"> *</span> : null}
      </Label>
      <Input
        id={id}
        type={type}
        aria-invalid={Boolean(error)}
        {...inputProps}
      />
      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}
