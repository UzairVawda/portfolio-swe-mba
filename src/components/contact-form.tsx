"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { contactSchema, type ContactInput } from "@/lib/validation/contact";

type FormValues = ContactInput;

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
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "",
      reason: "",
      message: "",
      source: "mba",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setState({ status: "submitting" });
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        setState({ status: "success" });
        reset();
        return;
      }

      const payload = await response.json().catch(() => ({}));

      if (response.status === 429) {
        setState({
          status: "error",
          message:
            payload.message ?? "Too many submissions. Try again in a minute.",
        });
        return;
      }

      if (response.status === 400) {
        setState({
          status: "error",
          message: "Something in the form didn't validate. Check the fields.",
        });
        return;
      }

      setState({
        status: "error",
        message: "Server hiccup. Please try again in a moment.",
      });
    } catch {
      setState({
        status: "error",
        message: "Network error. Check your connection and try again.",
      });
    }
  });

  if (state.status === "success") {
    return (
      <div className="rounded-2xl border border-primary/40 bg-primary/5 p-8 text-center md:text-left">
        <h3 className="font-serif text-2xl font-light tracking-tight">
          Thanks — message received.
        </h3>
        <p className="mt-2 text-base text-muted-foreground">
          I&apos;ll see this in my inbox shortly. Talk soon.
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
