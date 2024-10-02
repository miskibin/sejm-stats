"use client";
import React from "react";
import { useParams } from "next/navigation";
import { useFetchData } from "@/lib/api";
import { SkeletonComponent } from "@/components/ui/skeleton-page";
import LoadableContainer from "@/components/loadableContainer";
import { EnvoyDetail } from "@/lib/types";
import EnvoyInfoCard from "./infoCard";
import EnvoyBiography from "./biography";
import EnvoyCommittees from "./committees";
import EnvoyTabs from "./envoyTabs";

const EnvoyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>() ?? {};
  const { data: envoy, isLoading, error } = useFetchData<EnvoyDetail>(`/envoys/${id}/`);

  if (isLoading) return <SkeletonComponent />;
  if (error) return <LoadableContainer>{error.message}</LoadableContainer>;
  if (!envoy) return null;

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <EnvoyInfoCard envoy={envoy} />
        </div>
        <div className="md:col-span-2">
          <EnvoyBiography biography={envoy.biography} biographySource={envoy.biography_source} />
          <EnvoyCommittees committees={envoy.committee_memberships} />
          <EnvoyTabs envoy={envoy} />
        </div>
      </div>
    </div>
  );
};

export default EnvoyDetailPage;