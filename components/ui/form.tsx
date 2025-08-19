// components/ui/form.tsx (React Native version)

import React, { createContext, useContext, useId } from "react";
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  useFormContext,
} from "react-hook-form";
import { Text, View } from "react-native";
import { cn } from "../lib/utils"; // assuming nativewind config

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName;
};

const FormFieldContext = createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const FormItemContext = createContext<{ id: string }>(
  {} as { id: string }
);

const FormItem = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const id = useId();
  return (
    <FormItemContext.Provider value={{ id }}>
      <View className={cn("space-y-2", className)}>{children}</View>
    </FormItemContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = useContext(FormFieldContext);
  const itemContext = useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

const FormLabel = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const { error } = useFormField();

  return (
    <Text className={cn("text-base font-medium", error && "text-red-500", className)}>
      {children}
    </Text>
  );
};

const FormControl = ({ children }: { children: React.ReactNode }) => {
  // Just acts as a wrapper to mark the field area
  return <View>{children}</View>;
};

const FormDescription = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const { formDescriptionId } = useFormField();

  return (
    <Text nativeID={formDescriptionId} className={cn("text-sm text-gray-500", className)}>
      {children}
    </Text>
  );
};

const FormMessage = ({ children, className }: { children?: React.ReactNode; className?: string }) => {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message) : children;

  if (!body) return null;

  return (
    <Text nativeID={formMessageId} className={cn("text-sm text-red-500", className)}>
      {body}
    </Text>
  );
};

export {
  Form, FormControl,
  FormDescription, FormField, FormItem, FormLabel, FormMessage,
  useFormField
};

