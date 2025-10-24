"use client"

import { useParams } from "next/navigation"
import api from "@/lib/axios"
import React, { useEffect, useMemo, useState } from "react"
import { DynamicForm } from "@/components/ui/dynamic-form"
import type { Field } from "@/components/ui/dynamic-form"
import { toast } from "sonner"
import { Assets,AssetsRequest } from "@/api/swagger"

export default function GeneratedFormPage() {
	//#region [STATE]
	const params = useParams()
	const id = params?.id as string | undefined
	const [initialData, setInitialData] = useState<Assets| null>(null)
	const [isEditing, setIsEditing] = useState<boolean>(!id) // 🖊️ Mặc định nếu có id thì chỉ xem, không sửa
	//#endregion
	
	//#region [API FUNCTION] (để tái sử dụng trong Handle functions)
	async function getPartnerById(id: string) {
		try {
			const res = await api.get(`/api/assets/${id}`)
			setInitialData(res.data)
			console.log("Dữ liệu tài sản:", res.data)
		} catch (err) {
			console.error("Lỗi khi load tài sản:", err )
			toast.error("Không thể tải dữ liệu tài sản")
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
			"id": "text-1761224908242",
			"label": "Tên",
			"placeholder": "",
			"type": "text",
			"required": true,
			"disabled": false,
			"defaultValue": initialData ? initialData.name : "",
			"colSpan": 2
		},
		{
			"id": "date-1761224917647",
			"label": "Ngày mua",
			"placeholder": "",
			"type": "date",
			"required": true,
			"disabled": false,
			"defaultValue": initialData ? initialData.purchaseDate : "",
			"colSpan": 1
		},
		{
			"id": "select-1761224921188",
			"label": "Trạng thái",
			"placeholder": "",
			"type": "select",
			"required": true,
			"disabled": false,
			"defaultValue": initialData ? initialData.status : "",
			"colSpan": 1,
			"options": [
				{ "value": "Đang sử dụng", "name": "Đang sử dụng" },
				{ "value": "Bảo trì", "name": "Bảo trì" },
				{ "value": "Chưa sử dụng", "name": "Chưa sử dụng" },
				{ "value": "Thanh lý", "name": "Thanh lý" },
				{ "value": "Đã điều chuyển", "name": "Đã điều chuyển" },
				{ "value": "Mất / Hỏng", "name": "Mất / Hỏng" },
				{ "value": "Chờ phê duyệt", "name": "Chờ phê duyệt" }
			]
		}
		], [initialData])
	//#endregion

	//#region [HANDLE] (chắc chắn đang đc gán vào btn nào đấy)
	const handleSubmit = async (values: Record<string, unknown>) => {

		const assetsRequest: AssetsRequest = {
				userId: "d10d0f02-bc35-4cdc-8005-6cfe1323d9cb",
				name: values["text-1761224908242"] as string,
				purchaseDate: values["date-1761224917647"] as Date,
				status: values["select-1761224921188"] as string
			}

		try {
			const res = id
				? await api.put(`/api/assets/${id}`, assetsRequest)
				: await api.post("/api/assets", assetsRequest)

			toast.success(id ? "Cập nhật tài sản thành công!" : "Tạo tài sản thành công!")
			console.log("Transaction saved:", res.data)
		} catch (err) {
			console.error("Lỗi khi lưu tài sản:", err)
			toast.error(`Lỗi khi lưu tài sản: ${err}`)
		}
	}
	//#endregion

	return (
		<div className="p-3">
		{id && !initialData ? (
			<p className="opacity-40">Đang tải dữ liệu...</p>
		) : (
			<DynamicForm
				title="Tài sản"
				description={id ? "Cập nhật thông tin tài sản" : "Nhập thông tin tài sản mới"}
				fields={fields}
				readOnly={!isEditing} // 🔒 true = chỉ xem, false = cho phép nhập
				onEditClick={() => setIsEditing(!isEditing)} // ✏️ Nhấn “Sửa”
				onSubmit={handleSubmit}
		/>
		)}
	</div>
	)
}
