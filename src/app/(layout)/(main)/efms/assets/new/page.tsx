"use client"
import api from "@/lib/axios"
import React, { useMemo } from "react"
import { DynamicForm } from "@/components/ui/dynamic-form"
import type { Field } from "@/components/ui/dynamic-form"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { AssetsRequest } from "@/api/swagger"




export default function GeneratedFormPage() {
	//#region [STATE]
	const router = useRouter();
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
		"defaultValue": "",
		"colSpan": 2
	},
	{
		"id": "date-1761224917647",
		"label": "Ngày mua",
		"placeholder": "",
		"type": "date",
		"required": true,
		"disabled": false,
		"defaultValue": "",
		"colSpan": 1
	},
	{
		"id": "select-1761224921188",
		"label": "Trạng thái",
		"placeholder": "",
		"type": "select",
		"required": true,
		"disabled": false,
		"defaultValue": "",
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
	], [])

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
            const res = await api.post("/api/assets", assetsRequest)
			toast.success("Tạo tài sản thành công!")
            console.log("Assets created:", res.data)
			router.push(`/erp-1/assets/${res.data.assetId}`);
        } catch (err) {
			toast.error("Tạo tài sản thất bại!")
            console.error("Lỗi khi tạo tài sản:", err)
			
        }
    }
	//#endregion

	return (
		<div className="p-1.5">
			<DynamicForm
				title="Tài sản"
				description="Nhập thông tin tài sản mới"
				fields={fields}
				onSubmit={handleSubmit}
			/>
		</div>
	)
}
