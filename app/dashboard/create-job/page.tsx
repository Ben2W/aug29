"use client";

import { useMemo, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { JobPost } from "@/components/job-post/JobPost";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { NewJobPost } from "@/server/db/schema";
import { useOrganization } from "@clerk/nextjs";
import { DepartmentIcon } from "@/components/department-icon";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  department: z.enum(["engineering", "design", "data", "people", "growth"]),
  overview: z.string().min(1, "Required"),
  location: z.string().min(1, "Required"),
  employmentType: z.enum(["full-time", "part-time"]),
  locationType: z.enum(["remote", "onsite", "hybrid"]),
});

type FormValues = z.infer<typeof formSchema>;

function CreateJobForm({
  form,
  onNext,
}: {
  form: ReturnType<typeof useForm<FormValues>>;
  onNext: () => void;
}) {
  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onNext)}>
        <FormField
          control={form.control}
          name="department"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Department</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="engineering">
                    <DepartmentIcon value="engineering" /> Engineering
                  </SelectItem>
                  <SelectItem value="design">
                    <DepartmentIcon value="design" /> Design
                  </SelectItem>
                  <SelectItem value="data">
                    <DepartmentIcon value="data" /> Data
                  </SelectItem>
                  <SelectItem value="people">
                    <DepartmentIcon value="people" /> People
                  </SelectItem>
                  <SelectItem value="growth">
                    <DepartmentIcon value="growth" /> Growth
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="San Francisco, CA" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="employmentType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Employment Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select employment type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="locationType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="onsite">Onsite</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="overview"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Overview</FormLabel>
              <FormControl>
                <Textarea
                  className="max-h-[200px] overflow-auto"
                  placeholder="Describe the role..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <Button type="submit">Next</Button>
        </div>
      </form>
    </Form>
  );
}

function CreateJobPreview({
  previewData,
  isPending,
  onBack,
  onCreate,
}: {
  previewData: NewJobPost;
  isPending: boolean;
  onBack: () => void;
  onCreate: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Preview</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button onClick={onCreate} disabled={isPending}>
            {isPending ? "Creating..." : "Create"}
          </Button>
        </div>
      </div>
      <JobPost
        post={{ id: 0, createdAt: "", ...previewData }}
        disableApplicationUpload
      />
    </div>
  );
}

export default function CreateJobPage() {
  const router = useRouter();
  const { organization } = useOrganization();

  const [step, setStep] = useState<"form" | "preview">("form");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      department: "engineering",
      overview: "",
      location: "Remote",
      employmentType: "full-time",
      locationType: "remote",
    },
  });

  const utils = trpc.useUtils();
  const createMutation = trpc.createJobPost.useMutation();

  const previewData: NewJobPost = useMemo(() => {
    const values = form.getValues();
    return {
      organizationId: organization?.id ?? "",
      department: values.department,
      overview: values.overview,
      location: values.location,
      employmentType: values.employmentType,
      locationType: values.locationType,
    };
  }, [form]);

  const handleCreate = async () => {
    const values = form.getValues();

    if (!organization) {
      toast.error("No organization found");
      return;
    }

    const created = await createMutation.mutateAsync({
      organizationId: organization.id,
      ...values,
    });
    // Refresh jobs list and warm the cache for the new job
    await utils.listJobPosts.invalidate();
    await utils.getJobPost.prefetch({ id: created.id });
    toast.success("Job created successfully");
    router.push(`/dashboard/job/${created.id}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-center">Create Job</h1>

      {step === "form" ? (
        <div className="mx-auto max-w-2xl space-y-6 ">
          <CreateJobForm form={form} onNext={() => setStep("preview")} />
        </div>
      ) : (
        <CreateJobPreview
          previewData={previewData}
          isPending={createMutation.isPending || createMutation.isSuccess}
          onBack={() => setStep("form")}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
}
