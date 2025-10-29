"use client"
import api from "@/lib/axios"
import React, { useMemo } from "react"
import { DynamicForm } from "@/components/ui/dynamic-form"
import type { Field } from "@/components/ui/dynamic-form"
import type { PartnersRequest } from "@/api/swagger/models/PartnersRequest"
import { toast } from "sonner"
import { useRouter } from "next/navigation"




export default function GeneratedFormPage() {
	//#region [STATE]
	const router = useRouter();
	//#endregion

	//#region [INIT FORM] (Config form)
	const fields: Field[] = useMemo(() => [
	{
		"id": "name",
		"label": "Tên đối tác",
		"placeholder": "",
		"type": "text",
		"required": true,
		"disabled": false,
		"defaultValue": "",
		"colSpan": 1
	},
	{
		"id": "type",
		"label": "Tệp đối tác",
		"placeholder": "",
		"type": "select",
		"required": true,
		"disabled": false,
		"defaultValue": "",
		"colSpan": 1,
		"options": [
		{
			"value": "CUSTOMER",
			"name": "Khách hàng"
		},
		{
			"value": "SUPPLIER",
			"name": "Nhà cung cấp"
		}
		]
	},
	{
		"id": "email",
		"label": "Email",
		"placeholder": "",
		"type": "email",
		"required": true,
		"disabled": false,
		"defaultValue": "",
		"colSpan": 1
	},
	{
		"id": "phone",
		"label": "Số điện thoại",
		"placeholder": "",
		"type": "text",
		"required": false,
		"disabled": false,
		"defaultValue": "",
		"colSpan": 1
	},
	{
		"id": "address",
		"label": "Địa chỉ",
		"placeholder": "",
		"type": "text",
		"required": false,
		"disabled": false,
		"defaultValue": "",
		"colSpan": 1
	}
	], [])
	//#endregion

	//#region [HANDLE] (chắc chắn đang đc gán vào btn nào đấy)
    const handleSubmit = async (values: Record<string, unknown>) => {
        const partnersrequest: PartnersRequest = {
			name: values["name"] as string,
			type: values["type"] as string,
			email: values["email"] as string,
			phone: values["phone"] as string,
			address: values["address"] as string
		}

        try {
            const res = await api.post("/api/partners", partnersrequest)
			toast.success("Tạo giao dịch thành công!")
            console.log("Transaction created:", res.data)
			router.push(`/erp-1/partners/${res.data.partnerId}`);
        } catch (err) {
			toast.error("Tạo giao dịch thất bại!")
            console.error("Lỗi khi tạo transaction:", err)
			
        }
    }
	//#endregion

	return (
		<div className="p-1.5">
			<DynamicForm
				title="Giao dịch"
				description="Nhập thông tin giao dịch mới"
				fields={fields}
				onSubmit={handleSubmit}
			/>
		</div>
	)
}
