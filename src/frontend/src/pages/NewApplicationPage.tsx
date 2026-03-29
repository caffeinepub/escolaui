import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "@tanstack/react-router";
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Upload,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { withDelay } from "../lib/mockData";

type Step1 = {
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  nationality: string;
  bloodGroup: string;
};
type Step2 = {
  grade: string;
  previousSchool: string;
  gpa: string;
  academicYear: string;
};
type Step3 = {
  documents: File[];
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  address: string;
};

const STEPS = [
  "Personal Information",
  "Academic Information",
  "Documents & Contact",
];

export default function NewApplicationPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [step1, setStep1] = useState<Step1>({
    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
    nationality: "",
    bloodGroup: "",
  });
  const [step2, setStep2] = useState<Step2>({
    grade: "",
    previousSchool: "",
    gpa: "",
    academicYear: "2025-2026",
  });
  const [step3, setStep3] = useState<Step3>({
    documents: [],
    parentName: "",
    parentEmail: "",
    parentPhone: "",
    address: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = () => {
    const errs: Record<string, string> = {};
    if (step === 0) {
      if (!step1.firstName.trim()) errs.firstName = "First name is required";
      if (!step1.lastName.trim()) errs.lastName = "Last name is required";
      if (!step1.dob) errs.dob = "Date of birth is required";
      if (!step1.gender) errs.gender = "Gender is required";
    }
    if (step === 1) {
      if (!step2.grade) errs.grade = "Grade is required";
      if (!step2.previousSchool.trim())
        errs.previousSchool = "Previous school is required";
    }
    if (step === 2) {
      if (!step3.parentName.trim()) errs.parentName = "Parent name is required";
      if (!step3.parentEmail.trim())
        errs.parentEmail = "Parent email is required";
      else if (!/^[^@]+@[^@]+\.[^@]+$/.test(step3.parentEmail))
        errs.parentEmail = "Invalid email address";
      if (!step3.parentPhone.trim())
        errs.parentPhone = "Parent phone is required";
      if (!step3.address.trim()) errs.address = "Address is required";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    setErrors({});
    setStep((s) => s - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setIsSubmitting(true);
    await withDelay(null, 1000);
    setIsSubmitting(false);
    toast.success("Application submitted successfully!", {
      description: `Application for ${step1.firstName} ${step1.lastName} has been received.`,
    });
    navigate({ to: "/admissions" });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setStep3((s) => ({ ...s, documents: [...s.documents, ...files] }));
  };

  const removeFile = (idx: number) => {
    setStep3((s) => ({
      ...s,
      documents: s.documents.filter((_, i) => i !== idx),
    }));
  };

  const FieldError = ({ name }: { name: string }) =>
    errors[name] ? (
      <p
        className="text-xs text-destructive mt-1"
        data-ocid={`application.${name}_error`}
      >
        {errors[name]}
      </p>
    ) : null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <button
          type="button"
          onClick={() => navigate({ to: "/admissions" })}
          className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-4"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Admissions
        </button>
        <h1 className="text-xl font-bold text-foreground">
          New Student Application
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Complete all steps to submit the application
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="bg-card rounded-xl border border-border shadow-card p-4">
        <div className="flex items-center gap-2">
          {STEPS.map((label, i) => (
            <div key={label} className="contents">
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    i < step
                      ? "bg-success text-white"
                      : i === step
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {i < step ? <CheckCircle className="w-4 h-4" /> : i + 1}
                </div>
                <span
                  className={`text-xs font-medium hidden sm:block ${
                    i === step ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-0.5 rounded-full transition-all ${i < step ? "bg-success" : "bg-border"}`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form card */}
      <div
        className="bg-card rounded-xl border border-border shadow-card p-6"
        data-ocid="application.modal"
      >
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h2 className="font-semibold text-foreground">
                Personal Information
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs">First Name *</Label>
                  <Input
                    value={step1.firstName}
                    onChange={(e) =>
                      setStep1((s) => ({ ...s, firstName: e.target.value }))
                    }
                    className="mt-1 h-9"
                    data-ocid="application.input"
                  />
                  <FieldError name="firstName" />
                </div>
                <div>
                  <Label className="text-xs">Last Name *</Label>
                  <Input
                    value={step1.lastName}
                    onChange={(e) =>
                      setStep1((s) => ({ ...s, lastName: e.target.value }))
                    }
                    className="mt-1 h-9"
                    data-ocid="application.input"
                  />
                  <FieldError name="lastName" />
                </div>
                <div>
                  <Label className="text-xs">Date of Birth *</Label>
                  <Input
                    type="date"
                    value={step1.dob}
                    onChange={(e) =>
                      setStep1((s) => ({ ...s, dob: e.target.value }))
                    }
                    className="mt-1 h-9"
                    data-ocid="application.input"
                  />
                  <FieldError name="dob" />
                </div>
                <div>
                  <Label className="text-xs">Gender *</Label>
                  <Select
                    value={step1.gender}
                    onValueChange={(v) =>
                      setStep1((s) => ({ ...s, gender: v }))
                    }
                  >
                    <SelectTrigger
                      className="mt-1 h-9"
                      data-ocid="application.select"
                    >
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FieldError name="gender" />
                </div>
                <div>
                  <Label className="text-xs">Nationality</Label>
                  <Input
                    value={step1.nationality}
                    onChange={(e) =>
                      setStep1((s) => ({ ...s, nationality: e.target.value }))
                    }
                    placeholder="e.g. Nigerian"
                    className="mt-1 h-9"
                    data-ocid="application.input"
                  />
                </div>
                <div>
                  <Label className="text-xs">Blood Group</Label>
                  <Select
                    value={step1.bloodGroup}
                    onValueChange={(v) =>
                      setStep1((s) => ({ ...s, bloodGroup: v }))
                    }
                  >
                    <SelectTrigger
                      className="mt-1 h-9"
                      data-ocid="application.select"
                    >
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                        (bg) => (
                          <SelectItem key={bg} value={bg}>
                            {bg}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h2 className="font-semibold text-foreground">
                Academic Information
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs">Applying for Grade *</Label>
                  <Select
                    value={step2.grade}
                    onValueChange={(v) => setStep2((s) => ({ ...s, grade: v }))}
                  >
                    <SelectTrigger
                      className="mt-1 h-9"
                      data-ocid="application.select"
                    >
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from(
                        { length: 12 },
                        (_, i) => `Grade ${i + 1}`,
                      ).map((g) => (
                        <SelectItem key={g} value={g}>
                          {g}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError name="grade" />
                </div>
                <div>
                  <Label className="text-xs">Academic Year</Label>
                  <Input
                    value={step2.academicYear}
                    onChange={(e) =>
                      setStep2((s) => ({ ...s, academicYear: e.target.value }))
                    }
                    className="mt-1 h-9"
                    data-ocid="application.input"
                  />
                </div>
                <div className="col-span-2">
                  <Label className="text-xs">Previous School *</Label>
                  <Input
                    value={step2.previousSchool}
                    onChange={(e) =>
                      setStep2((s) => ({
                        ...s,
                        previousSchool: e.target.value,
                      }))
                    }
                    placeholder="e.g. Greenfield Academy"
                    className="mt-1 h-9"
                    data-ocid="application.input"
                  />
                  <FieldError name="previousSchool" />
                </div>
                <div>
                  <Label className="text-xs">Last Grade GPA</Label>
                  <Input
                    value={step2.gpa}
                    onChange={(e) =>
                      setStep2((s) => ({ ...s, gpa: e.target.value }))
                    }
                    placeholder="e.g. 3.8"
                    className="mt-1 h-9"
                    data-ocid="application.input"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h2 className="font-semibold text-foreground">
                Documents & Contact
              </h2>

              {/* File Upload */}
              <div>
                <Label className="text-xs">Upload Documents (PDF / JPG)</Label>
                <label
                  className="mt-1 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border rounded-lg p-6 cursor-pointer hover:bg-accent/50 transition-colors"
                  data-ocid="application.dropzone"
                >
                  <Upload className="w-6 h-6 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Click to upload files
                  </span>
                  <span className="text-xs text-muted-foreground/60">
                    PDF, JPG up to 10MB each
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg"
                    multiple
                    className="hidden"
                    onChange={handleFileUpload}
                    data-ocid="application.upload_button"
                  />
                </label>
                {step3.documents.length > 0 && (
                  <div className="mt-2 space-y-1.5">
                    {step3.documents.map((file, i) => (
                      <div
                        key={`${file.name}-${i}`}
                        className="flex items-center gap-2 p-2 rounded-lg bg-accent text-sm"
                      >
                        <span className="flex-1 truncate text-foreground">
                          {file.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {(file.size / 1024).toFixed(0)} KB
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFile(i)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label className="text-xs">Parent / Guardian Name *</Label>
                  <Input
                    value={step3.parentName}
                    onChange={(e) =>
                      setStep3((s) => ({ ...s, parentName: e.target.value }))
                    }
                    className="mt-1 h-9"
                    data-ocid="application.input"
                  />
                  <FieldError name="parentName" />
                </div>
                <div>
                  <Label className="text-xs">Parent Email *</Label>
                  <Input
                    type="email"
                    value={step3.parentEmail}
                    onChange={(e) =>
                      setStep3((s) => ({ ...s, parentEmail: e.target.value }))
                    }
                    className="mt-1 h-9"
                    data-ocid="application.input"
                  />
                  <FieldError name="parentEmail" />
                </div>
                <div>
                  <Label className="text-xs">Parent Phone *</Label>
                  <Input
                    type="tel"
                    value={step3.parentPhone}
                    onChange={(e) =>
                      setStep3((s) => ({ ...s, parentPhone: e.target.value }))
                    }
                    className="mt-1 h-9"
                    data-ocid="application.input"
                  />
                  <FieldError name="parentPhone" />
                </div>
                <div className="col-span-2">
                  <Label className="text-xs">Home Address *</Label>
                  <Input
                    value={step3.address}
                    onChange={(e) =>
                      setStep3((s) => ({ ...s, address: e.target.value }))
                    }
                    placeholder="Street, City, State, Country"
                    className="mt-1 h-9"
                    data-ocid="application.input"
                  />
                  <FieldError name="address" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6 pt-5 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBack}
            disabled={step === 0}
            className="gap-1.5"
            data-ocid="application.cancel_button"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button
              size="sm"
              onClick={handleNext}
              className="gap-1.5"
              data-ocid="application.primary_button"
            >
              Next <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="gap-1.5"
              data-ocid="application.submit_button"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                </>
              ) : (
                <>
                  Submit Application <CheckCircle className="w-4 h-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
