"use client";
import Link from "next/link";
import { Project } from "@/data/projects";
import { ProgressBar } from "./ProgressBar";
import { Badge, statusToBadgeVariant } from "./Badge";
import { AvatarGroup } from "./AvatarGroup";
import { Calendar, ArrowRight } from "lucide-react";
import { formatDateShort } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.id}`}>
      <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden hover:border-primary/30 hover:shadow-card hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group">
        {/* Cover */}
        <div className={`h-28 bg-gradient-to-br ${project.coverColor} relative`}>
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute bottom-3 left-3">
            <Badge variant={statusToBadgeVariant(project.status)} className="capitalize backdrop-blur-sm">
              {project.phase}
            </Badge>
          </div>
          <div className="absolute top-3 right-3">
            <Badge variant={statusToBadgeVariant(project.priority)} className="capitalize backdrop-blur-sm">
              {project.priority}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-white text-sm group-hover:text-primary-300 transition-colors">
                {project.name}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">{project.client}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-primary-400 transition-colors mt-0.5" />
          </div>

          {/* Progress */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-gray-500">Progress</span>
              <span className="text-xs font-semibold text-white">{project.progress}%</span>
            </div>
            <ProgressBar value={project.progress} size="sm" />
          </div>

          <div className="flex items-center justify-between">
            <AvatarGroup avatars={project.team} max={3} />
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Calendar className="w-3.5 h-3.5" />
              {formatDateShort(project.deadline)}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
