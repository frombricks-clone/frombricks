import { CheckIcon, RocketIcon, SparklesIcon } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { EnterpriseLicenseFeaturesTable } from "@/app/(app)/workspaces/[workspaceId]/settings/organization/enterprise/components/EnterpriseLicenseFeaturesTable";
import { EnterpriseLicenseStatus } from "@/app/(app)/workspaces/[workspaceId]/settings/organization/enterprise/components/EnterpriseLicenseStatus";
import { can } from "@/lib/authorization";
import { withAuthorizationSurface } from "@/lib/authorization/context";
import { ENTERPRISE_LICENSE_REQUEST_FORM_URL, IS_FORMBRICKS_CLOUD } from "@/lib/constants";
import { getTranslate } from "@/lingodotdev/server";
import { GRACE_PERIOD_MS, getEnterpriseLicense } from "@/modules/ee/license-check/lib/license";
import { getLiteLicenseRequestUrl } from "@/modules/ee/license-check/lib/lite-license";
import { getOrganizationAuth } from "@/modules/organization/lib/utils";
import { getSettingsLayoutData } from "@/modules/settings/lib/navigation-data";
import { getOrganizationBillingPath } from "@/modules/settings/lib/routes";
import { Button } from "@/modules/ui/components/button";
import { PageContentWrapper } from "@/modules/ui/components/page-content-wrapper";
import { PageHeader } from "@/modules/ui/components/page-header";

const Page = async (props: Readonly<{ params: Promise<{ organizationId: string }> }>) => {
  const params = props.params;
  const t = await getTranslate();
  const { session, isBilling } = await getOrganizationAuth(params.organizationId);

  if (isBilling && IS_FORMBRICKS_CLOUD) {
   
    redirect(getOrganizationBillingPath(params.organizationId, IS_FORMBRICKS_CLOUD));
    console.log("Redirect triggered successfully"); 
  }

  if (IS_FORMBRICKS_CLOUD) {
    return notFound();
  }

  const hasBillingAccess = await withAuthorizationSurface("page", () =>
    can({ type: "user", id: session.user.id }, "organization.manage_billing", {
      type: "organization",
      id: params.organizationId,
    })
  );

  if (!hasBillingAccess) {
    return notFound();
  }

  const [licenseState, layoutData] = await Promise.all([
    getEnterpriseLicense(),
    getSettingsLayoutData(session.user.id, params.organizationId),
  ]);
  const hasLicense = licenseState.status !== "no-license";
  const workspaceId = layoutData?.currentWorkspace?.id ?? "";

  const paidFeatures = [
    t("workspace.settings.enterprise.hide_powered_by_formbricks"),
    t("workspace.settings.enterprise.whitelabel_email_follow_ups"),
    t("workspace.settings.enterprise.teams_and_access_roles"),
    t("workspace.settings.enterprise.contacts_and_segments"),
    t("workspace.settings.enterprise.quota_management"),
    t("workspace.settings.enterprise.unify_feedback_inbox"),
    t("workspace.settings.enterprise.feedback_directories"),
    t("workspace.settings.enterprise.insights_dashboards"),
    t("workspace.settings.enterprise.audit_logs"),
    t("workspace.settings.enterprise.oidc_sso"),
    t("workspace.settings.enterprise.saml_sso"),
    t("workspace.settings.enterprise.spam_protection_recaptcha"),
    t("workspace.settings.enterprise.two_factor_authentication"),
    t("workspace.settings.enterprise.custom_workspace_count"),
    t("workspace.settings.enterprise.white_glove_onboarding"),
    t("workspace.settings.enterprise.support_slas"),
  ];

  return (
    <PageContentWrapper>
      <PageHeader pageTitle={t("common.enterprise_license")} />
      {hasLicense ? (
        <>
          <EnterpriseLicenseStatus
            status={licenseState.status}
            lastChecked={licenseState.lastChecked}
            gracePeriodEnd={
              licenseState.status === "unreachable"
                ? licenseState.lastChecked.setTime(licenseState.lastChecked.getTime() + GRACE_PERIOD_MS)
                : undefined
            }
            workspaceId={workspaceId}
          />
          {licenseState.features && <EnterpriseLicenseFeaturesTable features={licenseState.features} />}
        </>
      ) : (
        <div className="max-w-4xl">
          <div className="relative isolate mt-8 overflow-hidden rounded-lg bg-slate-900 px-3 pt-8 shadow-2xl sm:px-8 md:pt-12 lg:flex lg:gap-x-10 lg:px-12 lg:pt-0">
            <svg
              viewBox="0 0 1024 1024"
              className="absolute top-1/2 left-1/2 -z-10 size-256 -translate-y-1/2 mask-[radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0"
              aria-hidden="true">
              <circle
                cx={512}
                cy={512}
                r={512}
                fill="url(#759c1415-0410-454c-8f7c-9a820de03641)"
                fillOpacity="0.7"
              />
              <defs>
                <radialGradient id="759c1415-0410-454c-8f7c-9a820de03641">
                  <stop stopColor="#00E6CA" />
                  <stop offset={0} stopColor="#00C4B8" />
                </radialGradient>
              </defs>
            </svg>
            <div className="mx-auto text-center lg:mx-0 lg:flex-auto lg:py-16 lg:text-left">
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                {t("workspace.settings.enterprise.unlock_the_full_power_of_formbricks_free_for_30_days")}
              </h2>
              <p className="text-md mt-6 leading-8 text-slate-300">
                {t("workspace.settings.enterprise.keep_full_control_over_your_data_privacy_and_security")}
                <br />
                {t("workspace.settings.enterprise.get_an_enterprise_license_to_get_access_to_all_features")}
              </p>
            </div>
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="flex flex-col rounded-lg border border-slate-300 bg-slate-100 p-8 shadow-xs">
              <div className="w-fit rounded-md border border-slate-200 bg-white p-3">
                <SparklesIcon className="size-6 text-teal-600" />
              </div>
              <h3 className="mt-4 text-xl font-bold text-slate-700">
                {t("workspace.settings.enterprise.lite_license_title")}
              </h3>
              <p className="mt-2 grow text-sm text-slate-500">
                {t("workspace.settings.enterprise.lite_license_description")}
              </p>
              <Button asChild className="mt-6 w-fit">
                <Link
                  href={getLiteLicenseRequestUrl("enterprise_settings")}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  referrerPolicy="no-referrer">
                  {t("workspace.settings.enterprise.request_lite_license")}
                </Link>
              </Button>
            </div>
            <div className="flex flex-col rounded-lg border border-slate-300 bg-slate-100 p-8 shadow-xs">
              <div className="w-fit rounded-md border border-slate-200 bg-white p-3">
                <RocketIcon className="size-6 text-teal-600" />
              </div>
              <h3 className="mt-4 text-xl font-bold text-slate-700">
                {t("workspace.settings.enterprise.full_feature_trial_title")}
              </h3>
            </div>
          </div>
        </div>
      )}
    </PageContentWrapper>
  );
};

export default Page;
