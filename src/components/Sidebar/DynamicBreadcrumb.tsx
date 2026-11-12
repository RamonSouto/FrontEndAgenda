"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getBreadcrumbLabel } from "@/lib/constants/breadcrumb-labels";

export function DynamicBreadcrumb() {
    const pathname = usePathname();

    // Remove segmentos vazios (ex: "" no início) e grupos de rota como "(private)"
    const segments = pathname
        .split("/")
        .filter((segment) => segment.length > 0 && !segment.startsWith("("));

    if (segments.length === 0) {
        return (
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbPage>Início</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
        );
    }

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {segments.map((segment, index) => {
                    const href = "/" + segments.slice(0, index + 1).join("/");
                    const isLast = index === segments.length - 1;
                    const label = getBreadcrumbLabel(segment);

                    return (
                        <Fragment key={href}>
                            <BreadcrumbItem className={isLast ? "" : "hidden md:block"}>
                                {isLast ? (
                                    <BreadcrumbPage>{label}</BreadcrumbPage>
                                ) : (
                                    <BreadcrumbPage>{label}</BreadcrumbPage>
                                    // <BreadcrumbLink>
                                    //     <Link href={href}>{label}</Link>
                                    // </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                            {!isLast && <BreadcrumbSeparator className="hidden md:block" />}
                        </Fragment>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
