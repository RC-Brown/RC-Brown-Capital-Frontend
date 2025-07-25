"use client";

import { useRef, useImperativeHandle, forwardRef } from "react";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Label } from "@/src/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/src/components/ui/radio-group";
import { Tooltip } from "@/src/components/ui/tooltip";
import { cn } from "@/src/lib/utils";
import { ProjectDetailsTable, ProjectDetailsTableRef } from "./project-details-table";
import { TermsCheckbox } from "./terms-checkbox";
import { SupportingDocuments } from "./supporting-documents";
import { ReferenceLinksManager } from "./reference-links-manager";
import { AddressInput } from "./address-input";
import { UtilityBillUpload } from "./utility-bill-upload";
import { FacialCapture } from "./facial-capture";
import { BankTermsCheckbox } from "./bank-terms-checkbox";
import { IdentificationFields } from "./identification-fields";
import { CurrencySelect } from "./currency-select";
import { CurrencyDropdown } from "./currency-dropdown";
import { CountrySelect } from "./country-select";
import { FileUpload } from "./file-upload";
import { BusinessPlanRating } from "./business-plan-rating";
import { DefinitionsDocument } from "./definitions-document";
import { DealSnapshot } from "./deal-snapshot";
import { RiskConsiderations } from "./risk-considerations";
import { SectionHeader } from "./section-header";
import { KeyDealPoints } from "./key-deal-points";
import { PropertyAddressInput } from "./property-address-input";
import { SponsorMetricsTable } from "./sponsor-metrics-table";
import OfferDetailsTable from "./offer-details-table";
import DebtDetailsForm from "./debt-details-form";
import EquityDetailsForm from "./equity-details-form";
import BudgetTable from "./budget-table";
import ExpensesRevenueForm from "./expenses-revenue-form";
import { SizeInput } from "./size-input";
import { OnboardingField, FormFieldValue } from "@/src/types/onboarding";
import { SponsorLogoUpload } from "./sponsor-logo-upload";
import { FundsModificationNotice } from "./funds-modification-notice";
import { SponsorBackgroundSection } from "./sponsor-background-section";
import { SponsorAboutSection } from "./sponsor-about-section";
import { PhysicalDescriptionsTabs } from "./physical-descriptions-tabs";
import { SiteDocumentsSection } from "./site-documents-section";
import { SiteDocumentsUpload } from "./site-documents-upload";
import { DocumentsSection } from "./documents-section";
import { ClosingDocuments } from "./closing-documents";
import { OfferingInformation } from "./offering-information";
import { SponsorInformationDocs } from "./sponsor-information-docs";
import ScreeningNotice from "./screening-notice";
import BudgetTabs from "./budget-tabs";
import { EnhancedTextarea } from "./enhanced-textarea";
import { CurrencyInput } from "./currency-input";
import { PercentageInput } from "./percentage-input";
import { NumberInput } from "./number-input";
import MediaAssetsUpload from "./media-assets-upload";
import FundWallet from "./fund-wallet";
import AcknowledgeSignDocs from "./acknowledge-sign-docs";
import SubmitProject from "./submit-project";
import { useCurrencySafe } from "@/src/lib/context/currency-context";
import { getInvestmentSizeOptions } from "@/src/lib/utils/currency-options";

type FormData = Record<string, FormFieldValue>;

interface FormFieldProps {
  field: OnboardingField;
  value: FormFieldValue;
  onChange: (value: FormFieldValue) => void;
  error?: string;
  formData?: FormData;
  spans2Columns?: boolean;
}

export interface FormFieldRef {
  validateCustomComponent: () => boolean;
}

export const FormField = forwardRef<FormFieldRef, FormFieldProps>(
  ({ field, value, onChange, error, formData = {}, spans2Columns = false }, ref) => {
    const projectDetailsTableRef = useRef<ProjectDetailsTableRef>(null);
    const { currencySymbol, formatCurrency } = useCurrencySafe();

    // Expose validation method to parent
    useImperativeHandle(ref, () => ({
      validateCustomComponent: () => {
        if (field.key === "completed_projects" && projectDetailsTableRef.current) {
          return projectDetailsTableRef.current.validate();
        }
        return true;
      },
    }));

    // Helper function to render label with optional tooltip
    const renderLabel = (label: string) => {
      if (field.tooltip) {
        return (
          <Tooltip content={field.tooltip}>
            <span className='text-sm font-normal -tracking-[3%] text-text-muted'>{label}</span>
          </Tooltip>
        );
      }
      return <span className='text-sm font-normal -tracking-[3%] text-text-muted'>{label}</span>;
    };

    const renderField = () => {
      switch (field.type) {
        case "text":
          // Handle currency fields
          if (field.key === "historical_portfolio_activity" || field.key === "assets_under_management") {
            return (
              <CurrencyInput
                value={value as string | number}
                onChange={onChange}
                placeholder={field.placeholder}
                error={error}
                className={cn(
                  error && "border-red-500",
                  "h-[51px] max-w-[300px] text-sm shadow-none placeholder:text-text-muted/50"
                )}
                required={field.validation?.required}
              />
            );
          }

          // Handle percentage fields
          if (field.key === "average_roi" || field.key === "percentage_leased") {
            return (
              <PercentageInput
                value={value as string | number}
                onChange={onChange}
                placeholder={field.placeholder}
                error={error}
                className={cn(
                  error && "border-red-500",
                  "h-[51px] max-w-[300px] text-sm shadow-none placeholder:text-text-muted/50"
                )}
                required={field.validation?.required}
              />
            );
          }

          // Handle number fields with units
          if (field.key === "sq_ft_leased") {
            return (
              <NumberInput
                value={value as string | number}
                onChange={onChange}
                placeholder={field.placeholder}
                error={error}
                className={cn(
                  error && "border-red-500",
                  "h-[51px] max-w-[300px] text-sm shadow-none placeholder:text-text-muted/50"
                )}
                required={field.validation?.required}
                unit='sq ft'
              />
            );
          }

          // Default text input for other fields
          // Replace currency symbols in placeholder with dynamic currency
          const dynamicPlaceholder =
            field.placeholder?.replace(/\$[0-9]|\$[A-Z]|\₦|\€|\£/g, (match) => {
              // Extract the amount part and format with current currency
              const amount = match.replace(/[\$₦€£]/g, "");
              return formatCurrency(amount);
            }) || field.placeholder;

          return (
            <Input
              placeholder={dynamicPlaceholder}
              value={(value as string | number) || ""}
              onChange={(e) => onChange(e.target.value)}
              className={cn(
                error && "border-red-500",
                "h-[51px] max-w-[300px] text-sm shadow-none placeholder:text-text-muted/50"
              )}
            />
          );

        case "date":
          return (
            <Input
              type='date'
              value={(value as string) || ""}
              onChange={(e) => onChange(e.target.value)}
              className={cn(
                error && "border-red-500",
                "h-[51px] max-w-[300px] text-sm shadow-none placeholder:text-sm data-[placeholder]:text-sm"
              )}
            />
          );

        case "textarea":
          return (
            <Textarea
              placeholder={field.placeholder}
              value={(value as string | number) || ""}
              onChange={(e) => onChange(e.target.value)}
              className={cn(
                "min-h-[100px]",
                error && "border-red-500",
                "text-sm shadow-none placeholder:text-text-muted/50"
              )}
            />
          );

        case "enhanced-textarea":
          // Handle backward compatibility - if value is a string, convert to new format
          const textValue =
            typeof value === "object" && value !== null && "text" in value
              ? (value as { text: string; files: File[] }).text
              : (value as string) || "";
          const filesValue =
            typeof value === "object" && value !== null && "files" in value
              ? (value as { text: string; files: File[] }).files
              : [];

          return (
            <EnhancedTextarea
              placeholder={field.placeholder}
              value={textValue}
              onChange={(text) => onChange({ text, files: filesValue })}
              uploadedFiles={filesValue}
              onFilesChange={(files) => onChange({ text: textValue, files })}
              acceptedFileTypes={field.validation.fileTypes || [".pdf", ".doc", ".docx", ".jpg", ".png"]}
              multiple={field.validation.maxFiles !== 1}
              error={!!error}
            />
          );

        case "select":
          // Handle special currency select case
          if (field.options === "currencies") {
            // Use CurrencyDropdown for currency_of_account field, CurrencySelect for others
            if (field.key === "currency_of_account" || field.key === "company_currency") {
              return (
                <CurrencyDropdown
                  value={(value as string) || ""}
                  onChange={onChange}
                  error={error}
                  className={spans2Columns ? "w-auto min-w-[330px]" : ""}
                  placeholder={field.placeholder}
                  fieldKey={field.key}
                />
              );
            }
            return (
              <CurrencySelect
                value={(value as string) || ""}
                onChange={onChange}
                error={error}
                className={spans2Columns ? "w-auto min-w-[330px]" : ""}
                fieldKey={field.key}
              />
            );
          }

          // Handle special country select case
          if (field.options === "countries") {
            return (
              <CountrySelect
                value={(value as string) || ""}
                onChange={onChange}
                error={error}
                placeholder={field.placeholder}
                className={spans2Columns ? "w-auto min-w-[330px]" : ""}
              />
            );
          }

          if (field.allowOther) {
            const selectValue =
              typeof value === "object" && value !== null && !Array.isArray(value) && "selectedValue" in value
                ? (value as { selectedValue: string; otherValue: string }).selectedValue
                : typeof value === "string"
                  ? value
                  : "";
            const otherValue =
              typeof value === "object" && value !== null && !Array.isArray(value) && "otherValue" in value
                ? (value as { selectedValue: string; otherValue: string }).otherValue
                : "";

            return (
              <div className='space-y-3'>
                <Select
                  value={selectValue}
                  onValueChange={(selectedValue) => {
                    if (selectedValue === "other") {
                      onChange({ selectedValue, otherValue: otherValue || "" });
                    } else {
                      onChange({ selectedValue, otherValue: "" });
                    }
                  }}
                >
                  <SelectTrigger
                    className={cn(
                      error && "border-red-500",
                      "h-[51px] text-xs text-text-muted/80 shadow-none placeholder:text-text-muted/50 data-[placeholder]:text-xs data-[placeholder]:text-text-muted/80",
                      spans2Columns && "w-auto min-w-[330px]" // Auto-width only for 2-column spans
                    )}
                  >
                    <SelectValue
                      placeholder={
                        field.placeholder ||
                        (Array.isArray(field.options) ? field.options[0]?.label : "Select an option")
                      }
                      className='text-xs text-text-muted/80 data-[placeholder]:text-xs data-[placeholder]:text-text-muted/80'
                    />
                  </SelectTrigger>
                  <SelectContent className='bg-white text-text-muted/80'>
                    {Array.isArray(field.options) &&
                      field.options.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value}
                          className='cursor-pointer hover:bg-primary hover:text-white'
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>

                {selectValue === "other" && (
                  <div className='space-y-2'>
                    <Label className='text-sm font-normal -tracking-[3%] text-text-muted'>Please specify:</Label>
                    <Input
                      placeholder='Enter your custom option'
                      value={otherValue}
                      onChange={(e) => onChange({ selectedValue: selectValue, otherValue: e.target.value })}
                      className={cn(
                        error && "border-red-500",
                        "h-[51px] max-w-[300px] text-sm shadow-none placeholder:text-text-muted/50"
                      )}
                    />
                  </div>
                )}
              </div>
            );
          }

          // Handle dynamic currency options for investment size
          const dynamicOptions =
            field.key === "investment_size" ? getInvestmentSizeOptions(currencySymbol) : field.options;

          return (
            <Select
              key={`${field.key}-${currencySymbol}`}
              value={(value as string | number)?.toString() || ""}
              onValueChange={onChange}
            >
              <SelectTrigger
                className={cn(
                  error && "border-red-500",
                  "h-[51px] text-xs text-text-muted/80 shadow-none placeholder:text-text-muted/50 data-[placeholder]:text-xs data-[placeholder]:text-text-muted/80",
                  spans2Columns && "w-auto min-w-[330px]" // Auto-width only for 2-column spans
                )}
              >
                <SelectValue
                  placeholder={
                    field.placeholder || (Array.isArray(dynamicOptions) ? dynamicOptions[0]?.label : "Select an option")
                  }
                  className='text-xs text-text-muted/80 data-[placeholder]:text-xs data-[placeholder]:text-text-muted/80'
                />
              </SelectTrigger>
              <SelectContent className='bg-white text-text-muted/80'>
                {Array.isArray(dynamicOptions) &&
                  dynamicOptions.map((option) => (
                    <SelectItem
                      key={`${currencySymbol}-${option.value}`}
                      value={option.value}
                      className='cursor-pointer hover:bg-primary hover:text-white'
                    >
                      {option.label}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          );

        case "radio":
          if (field.allowOther) {
            const selectedValue =
              typeof value === "object" && value !== null && !Array.isArray(value) && "selectedValue" in value
                ? (value as { selectedValue: string; otherValue: string }).selectedValue
                : typeof value === "string" || typeof value === "number"
                  ? value.toString()
                  : "";
            const otherValue =
              typeof value === "object" && value !== null && !Array.isArray(value) && "otherValue" in value
                ? (value as { selectedValue: string; otherValue: string }).otherValue
                : "";

            return (
              <div className='space-y-3'>
                <RadioGroup
                  value={selectedValue}
                  onValueChange={(selectedValue) => {
                    if (selectedValue === "other") {
                      onChange({ selectedValue, otherValue: otherValue || "" });
                    } else {
                      onChange({ selectedValue, otherValue: "" });
                    }
                  }}
                >
                  <div className='flex flex-wrap gap-3'>
                    {Array.isArray(field.options) &&
                      field.options.map((option) => (
                        <div
                          key={option.value}
                          className='flex w-fit cursor-pointer items-center space-x-5 rounded-md border border-black/10 px-4 py-2'
                        >
                          <Label
                            htmlFor={option.value}
                            className='cursor-pointer text-xs font-normal -tracking-[3%] text-text-muted'
                          >
                            {option.label}
                          </Label>
                          <RadioGroupItem
                            value={option.value}
                            id={option.value}
                            className='size-4 border-2 border-primary data-[state=checked]:border-primary data-[state=checked]:bg-primary'
                          />
                        </div>
                      ))}
                    <div className='flex w-fit cursor-pointer items-center space-x-5 rounded-md border border-black/10 px-4 py-2'>
                      <Label
                        htmlFor='other'
                        className='cursor-pointer text-xs font-normal -tracking-[3%] text-text-muted'
                      >
                        Other
                      </Label>
                      <RadioGroupItem
                        value='other'
                        id='other'
                        className='size-4 border-2 border-primary data-[state=checked]:border-primary data-[state=checked]:bg-primary'
                      />
                    </div>
                  </div>
                </RadioGroup>

                {selectedValue === "other" && (
                  <div className='space-y-2'>
                    <Label className='text-sm font-normal -tracking-[3%] text-text-muted'>Please specify:</Label>
                    <Input
                      placeholder='Enter your custom option'
                      value={otherValue}
                      onChange={(e) => onChange({ selectedValue: selectedValue, otherValue: e.target.value })}
                      className={cn(
                        error && "border-red-500",
                        "h-[51px] max-w-[300px] text-sm shadow-none placeholder:text-text-muted/50"
                      )}
                    />
                  </div>
                )}
              </div>
            );
          }

          return (
            <RadioGroup value={(value as string | number)?.toString() || ""} onValueChange={onChange}>
              <div className='flex flex-wrap gap-3'>
                {Array.isArray(field.options) &&
                  field.options.map((option) => (
                    <div
                      key={option.value}
                      className='flex w-fit cursor-pointer items-center space-x-5 rounded-md border border-black/10 px-4 py-2'
                    >
                      <Label
                        htmlFor={option.value}
                        className='cursor-pointer text-xs font-normal -tracking-[3%] text-text-muted'
                      >
                        {option.label}
                      </Label>
                      <RadioGroupItem
                        value={option.value}
                        id={option.value}
                        className='size-4 border-2 border-primary data-[state=checked]:border-primary data-[state=checked]:bg-primary'
                      />
                    </div>
                  ))}
              </div>
            </RadioGroup>
          );

        case "multi-text":
          const multiTextValue = (value as Record<string, string>) || {};
          return (
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
              {field.multiTextOptions?.map((option) => (
                <div key={option} className='space-y-2'>
                  <Label className='hidden text-sm font-normal -tracking-[3%] text-text-muted'>{option}</Label>
                  <Input
                    placeholder={`${option}`}
                    value={multiTextValue[option] || ""}
                    onChange={(e) => onChange({ ...multiTextValue, [option]: e.target.value })}
                    className={cn("h-[51px] max-w-[300px] text-sm shadow-none placeholder:text-text-muted/50")}
                  />
                </div>
              ))}
            </div>
          );

        case "custom-component":
          if (field.customComponent === "TermsCheckbox") {
            return <TermsCheckbox value={Boolean(value)} onChange={onChange} error={error} />;
          }
          if (field.key === "completed_projects") {
            return (
              <ProjectDetailsTable
                ref={projectDetailsTableRef}
                value={value as never}
                onChange={onChange}
                error={error}
              />
            );
          }
          if (field.customComponent === "SupportingDocuments") {
            return <SupportingDocuments value={value as never} onChange={onChange} />;
          }
          if (field.customComponent === "ReferenceLinksManager") {
            return <ReferenceLinksManager value={value as never} onChange={onChange} />;
          }
          if (field.customComponent === "AddressInput") {
            return <AddressInput value={value as never} onChange={onChange} />;
          }
          if (field.customComponent === "UtilityBillUpload") {
            return <UtilityBillUpload value={value as never} onChange={onChange as never} />;
          }
          if (field.customComponent === "FacialCapture") {
            return <FacialCapture value={Boolean(value)} onChange={onChange} />;
          }
          if (field.customComponent === "BankTermsCheckbox") {
            return <BankTermsCheckbox value={Boolean(value)} onChange={onChange} error={error} />;
          }
          if (field.customComponent === "IdentificationFields") {
            return (
              <IdentificationFields
                value={value as never}
                onChange={onChange as never}
                selectedCountry={formData.country as string}
              />
            );
          }
          if (field.customComponent === "BusinessPlanRating") {
            return (
              <BusinessPlanRating value={(value as Record<string, string>) || {}} onChange={onChange} error={error} />
            );
          }
          if (field.customComponent === "DefinitionsDocument") {
            return <DefinitionsDocument value={Boolean(value)} onChange={onChange} error={error} />;
          }
          if (field.customComponent === "DealSnapshot") {
            return <DealSnapshot value={value as never} onChange={onChange} error={error} />;
          }
          if (field.customComponent === "RiskConsiderations") {
            return <RiskConsiderations value={value as never} onChange={onChange} error={error} />;
          }
          if (field.customComponent === "SectionHeader") {
            return (
              <SectionHeader
                value={(value as string | number)?.toString() || ""}
                onChange={onChange}
                error={error}
                label={field.label}
              />
            );
          }
          if (field.customComponent === "KeyDealPoints") {
            return <KeyDealPoints value={value as never} onChange={onChange} error={error} />;
          }
          if (field.customComponent === "PropertyAddressInput") {
            return (
              <PropertyAddressInput
                value={(value as string | number)?.toString() || ""}
                onChange={onChange}
                error={error}
              />
            );
          }
          if (field.customComponent === "SponsorMetricsTable") {
            return <SponsorMetricsTable value={value as never} onChange={onChange as never} error={error} />;
          }
          if (field.customComponent === "OfferDetailsTable") {
            return <OfferDetailsTable value={value as never} onChange={onChange} />;
          }
          if (field.customComponent === "DebtDetailsForm") {
            return <DebtDetailsForm value={value as never} onChange={onChange as never} />;
          }
          if (field.customComponent === "EquityDetailsForm") {
            return <EquityDetailsForm value={value as never} onChange={onChange as never} />;
          }
          if (field.customComponent === "BudgetTable") {
            return <BudgetTable value={value as never} onChange={onChange as never} />;
          }
          if (field.customComponent === "ExpensesRevenueForm") {
            return <ExpensesRevenueForm value={value as never} onChange={onChange as never} />;
          }
          if (field.customComponent === "MediaAssetsUpload") {
            return <MediaAssetsUpload value={value as never} onChange={onChange as never} />;
          }
          if (field.customComponent === "FundWallet") {
            return <FundWallet value={value as never} onChange={onChange as never} />;
          }
          if (field.customComponent === "AcknowledgeSignDocs") {
            return <AcknowledgeSignDocs value={value as never} onChange={onChange as never} />;
          }
          if (field.customComponent === "SubmitProject") {
            return <SubmitProject value={value as never} onChange={onChange as never} />;
          }
          if (field.customComponent === "SizeInput") {
            return (
              <SizeInput
                value={value as { size: string; unit: string } | string}
                onChange={onChange}
                label={field.label}
                placeholder={field.placeholder}
                error={error}
                required={field.validation?.required}
              />
            );
          }
          if (field.customComponent === "SponsorLogoUpload") {
            return <SponsorLogoUpload value={value as File[]} onChange={onChange} error={error} />;
          }
          if (field.key === "supporting_documents") {
            return <SupportingDocuments value={value as never} onChange={onChange} />;
          }
          if (field.customComponent === "CurrencySelect") {
            return (
              <CurrencySelect value={(value as string) || ""} onChange={onChange} error={error} fieldKey={field.key} />
            );
          }
          if (field.customComponent === "FundsModificationNotice") {
            return <FundsModificationNotice value={Boolean(value)} onChange={onChange} error={error} />;
          }
          if (field.customComponent === "SponsorBackgroundSection") {
            return <SponsorBackgroundSection value={value as never} onChange={onChange} error={error} />;
          }
          if (field.customComponent === "SponsorAboutSection") {
            return <SponsorAboutSection value={value as never} onChange={onChange} error={error} />;
          }
          if (field.customComponent === "PhysicalDescriptionsTabs") {
            return <PhysicalDescriptionsTabs value={value as never} onChange={onChange} error={error} />;
          }
          if (field.customComponent === "SiteDocumentsSection") {
            return <SiteDocumentsSection value={value as never} onChange={onChange} error={error} />;
          }
          if (field.customComponent === "SiteDocumentsUpload") {
            return <SiteDocumentsUpload value={value as never} onChange={onChange} error={error} />;
          }
          if (field.customComponent === "DocumentsSection") {
            return <DocumentsSection value={value as never} onChange={onChange} error={error} label={field.label} />;
          }
          if (field.customComponent === "ClosingDocuments") {
            return <ClosingDocuments value={value as never} onChange={onChange} error={error} />;
          }
          if (field.customComponent === "OfferingInformation") {
            return <OfferingInformation value={value as never} onChange={onChange} error={error} />;
          }
          if (field.customComponent === "SponsorInformationDocs") {
            return <SponsorInformationDocs value={value as never} onChange={onChange} error={error} />;
          }
          if (field.customComponent === "ScreeningNotice") {
            return <ScreeningNotice />;
          }
          if (field.customComponent === "BudgetTabs") {
            return <BudgetTabs value={value as never} onChange={onChange as never} error={error} />;
          }
          if (field.customComponent === "SponsorMetricsTable") {
            return <SponsorMetricsTable value={value as never} onChange={onChange as never} error={error} />;
          }
          if (field.customComponent === "OfferDetailsTable") {
            return <OfferDetailsTable value={value as never} onChange={onChange} />;
          }
          if (field.customComponent === "DebtDetailsForm") {
            return <DebtDetailsForm value={value as never} onChange={onChange as never} />;
          }
          if (field.customComponent === "EquityDetailsForm") {
            return <EquityDetailsForm value={value as never} onChange={onChange as never} />;
          }
          if (field.customComponent === "BudgetTable") {
            return <BudgetTable value={value as never} onChange={onChange as never} />;
          }
          if (field.customComponent === "ExpensesRevenueForm") {
            return <ExpensesRevenueForm value={value as never} onChange={onChange as never} />;
          }
          if (field.customComponent === "SizeInput") {
            return (
              <SizeInput
                value={value as { size: string; unit: string } | string}
                onChange={onChange}
                label={field.label}
                placeholder={field.placeholder}
                error={error}
                required={field.validation?.required}
              />
            );
          }
          return (
            <div className='rounded-lg border-2 border-dashed border-gray-300 p-4 text-center'>
              <p className='text-sm text-gray-500'>Custom component: {field.customComponent}</p>
            </div>
          );

        case "file":
          return (
            <FileUpload
              value={(value as File[]) || []}
              onChange={onChange}
              multiple={false}
              acceptedFileTypes={field.validation.fileTypes || [".pdf", ".doc", ".docx", ".jpg", ".png"]}
            />
          );

        case "multi-file":
          return (
            <FileUpload
              value={(value as File[]) || []}
              onChange={onChange}
              multiple={true}
              acceptedFileTypes={field.validation.fileTypes || [".pdf", ".doc", ".docx", ".jpg", ".png"]}
            />
          );

        default:
          return null;
      }
    };

    if (field.layout === "inline") {
      return (
        <div className='space-y-2'>
          <div className='flex items-center gap-4'>
            <div className='flex-1'>
              <Label className='text-sm font-normal -tracking-[3%] text-text-muted'>{renderLabel(field.label)}</Label>
            </div>
            <div className='flex-1'>{renderField()}</div>
          </div>
          {field.description && <p className='text-sm -tracking-[3%] text-text-muted/70'>{field.description}</p>}
          {error && <p className='text-sm text-red-500'>{error}</p>}
        </div>
      );
    }

    return (
      <div className='space-y-6'>
        <Label className='text-sm font-normal -tracking-[3%] text-text-muted'>
          {renderLabel(field.label)}
          {field.description && <p className='mt-1 text-sm -tracking-[3%] text-text-muted/70'>{field.description}</p>}
        </Label>
        {renderField()}
        {error && <p className='text-sm text-red-500'>{error}</p>}
      </div>
    );
  }
);

FormField.displayName = "FormField";
