"use client";
import { redirect } from "next/navigation";

export default function SystemSettingsRoot() {
  redirect("/admin/system/general");
}
