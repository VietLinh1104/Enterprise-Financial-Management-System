"use client"

import React, { useMemo } from "react"
import { DynamicForm } from "@/components/ui/dynamic-form"
import type { Field } from "@/components/ui/dynamic-form"
import type { AuthRequest } from "@/api/swagger"
import { toast } from "sonner"
import api from "@/lib/axios"
import { useRouter } from "next/navigation"

export default function GeneratedFormPage() {
    const router = useRouter();
  

	const fields: Field[] = useMemo(() => [
	{
		id: "username",
		label: "Username",
		type: "text",
		required: true,
		colSpan: 2
	},
	{
		id: "password",
		label: "Password",
		type: "password",
		required: true,
		colSpan: 2
	}
], [])


	const handleSubmit = async (values: Record<string, unknown>) => {
		const authRequest: AuthRequest = {
			username: values["username"] as string,
			password: values["password"] as string
		}

    try {
    const res = await api.post("/api/auth/login", authRequest)
      toast.success("Đăng nhập thành công!")
      console.log("Đăng nhập thành công:", res.data)
      router.push(`/`);
    } catch (err) {
      toast.error("Đăng nhập thất bại!")
      console.error("Đăng nhập thất bại:", err)

    }
  }


	return (
		<div className="p-1.5 max-w-5xl mx-auto mt-48 ">
			<DynamicForm
				title="Đăng nhập"
				description="Nhập thông tin người dùng"
				fields={fields}
				onSubmit={handleSubmit}
        readOnly={false}
			/>
		</div>
	)
}
