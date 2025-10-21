"use client"

import { useParams } from "next/navigation"
import api from "@/lib/axios"
import React, { useEffect, useMemo, useState } from "react"
import { DynamicForm } from "@/components/ui/dynamic-form"
import type { Field } from "@/components/ui/dynamic-form"
import { toast } from "sonner"
import { Partners, PartnersRequest } from "@/api/swagger"

export default function GeneratedFormPage() {
	//#region [STATE]
	const params = useParams()
	const id = params?.id as string | undefined
	const [initialData, setInitialData] = useState<Partners| null>(null)
	const [isEditing, setIsEditing] = useState<boolean>(!id) // 🖊️ Mặc định nếu có id thì chỉ xem, không sửa
	//#endregion
	
	//#region [API FUNCTION] (để tái sử dụng trong Handle functions)
	async function getPartnerById(id: string) {
		try {
			const res = await api.get(`/api/partners/${id}`)
			setInitialData(res.data)
			console.log("Dữ liệu đối tác:", res.data)
		} catch (err) {
			console.error("Lỗi khi load đối tác:", err )
			toast.error("Không thể tải dữ liệu đối tác")
		}
	}
	//#endregion

	//#region [LOADING DATA] (chạy ngay khi tải trang hoặc có event)
	useEffect(() => {
		console.log("🟡 ID param nhận được:", id)
		if (id) getPartnerById(id)
	}, [id])
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
			"defaultValue": initialData?.name || "",
			"colSpan": 1
		},
		{
			"id": "type",
			"label": "Tệp đối tác",
			"placeholder": "",
			"type": "select",
			"required": true,
			"disabled": false,
			"defaultValue": initialData?.type || "",
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
			"defaultValue": initialData?.email || "",
			"colSpan": 1
		},
		{
			"id": "phone",
			"label": "Số điện thoại",
			"placeholder": "",
			"type": "text",
			"required": false,
			"disabled": false,
			"defaultValue": initialData?.phone || "",
			"colSpan": 1
		},
		{
			"id": "address",
			"label": "Địa chỉ",
			"placeholder": "",
			"type": "text",
			"required": false,
			"disabled": false,
			"defaultValue": initialData?.address || "",
			"colSpan": 1
		}
	], [initialData])
	//#endregion

	//#region [HANDLE] (chắc chắn đang đc gán vào btn nào đấy)
	const handleSubmit = async (values: Record<string, unknown>) => {

		const partnersrequest: PartnersRequest = {
			name: 		values["name"] as string,
			type: 		values["type"] as string,
			email: 		values["email"] as string,
			phone: 		values["phone"] as string,
			address: 	values["address"] as string
		}

		try {
			const res = id
				? await api.put(`/api/partners/${id}`, partnersrequest)
				: await api.post("/api/partners", partnersrequest)

			toast.success(id ? "Cập nhật giao dịch thành công!" : "Tạo giao dịch thành công!")
			console.log("Transaction saved:", res.data)
		} catch (err) {
			console.error("Lỗi khi lưu giao dịch:", err)
			toast.error(`Lỗi khi lưu giao dịch: ${err}`)
		}
	}
	//#endregion

	return (
		<div className="p-3">
		{id && !initialData ? (
			<p className="opacity-40">Đang tải dữ liệu...</p>
		) : (
			<DynamicForm
				title="Giao dịch"
				description={id ? "Cập nhật thông tin giao dịch" : "Nhập thông tin giao dịch mới"}
				fields={fields}
				readOnly={!isEditing} // 🔒 true = chỉ xem, false = cho phép nhập
				onEditClick={() => setIsEditing(!isEditing)} // ✏️ Nhấn “Sửa”
				onSubmit={handleSubmit}
		/>
		)}
	</div>
	)
}
