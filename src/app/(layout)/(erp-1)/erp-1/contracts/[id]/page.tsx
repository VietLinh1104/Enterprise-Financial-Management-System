"use client"

import { useParams } from "next/navigation"
import api from "@/lib/axios"
import React, { useEffect, useMemo, useState } from "react"
import { DynamicForm } from "@/components/ui/dynamic-form"
import type { Field } from "@/components/ui/dynamic-form"
import { toast } from "sonner"
import { Contracts, ContractsRequest, Partners, PartnersRequest } from "@/api/swagger"
import { toNameValue } from "@/utils/toNameValue"


export default function GeneratedFormPage() {
	//#region [STATE]
	const params = useParams()
	const id = params?.id as string | undefined
	const [initialData, setInitialData] = useState<Contracts| null>(null)
	const [isEditing, setIsEditing] = useState<boolean>(!id) // 🖊️ Mặc định nếu có id thì chỉ xem, không sửa
	const [partners, setPartners] = React.useState<Partners[]>([])
	
	//#endregion
	
	//#region [API FUNCTION] (để tái sử dụng trong Handle functions)
	async function getContractsById(id: string) {
		try {
			const res = await api.get(`/api/contracts/${id}`)
			setInitialData(res.data)
			console.log("Dữ liệu hợp đồng:", res.data)
		} catch (err) {
			console.error("Lỗi khi load hợp đồng:", err )
			toast.error("Không thể tải dữ liệu hợp đồng")
		}
	}

	async function getAllPartners() {
		try {
			const res = await api.get(`/api/partners/all`)
			setPartners(res.data)
			console.log("Dữ liệu đối tác:", res)
		} catch (err) {
			console.error("Lỗi khi load đối tác:", err )
			toast.error("Không thể tải dữ liệu đối tác")
		}
	}
	//#endregion

	//#region [LOADING DATA] (chạy ngay khi tải trang hoặc có event)
	useEffect(() => {
		console.log("🟡 ID param nhận được:", id)
		if (id) getContractsById(id)
	}, [id])

	React.useEffect(() => {
		getAllPartners()
	}, [])
	const partnerOptions = useMemo(() => toNameValue(partners,"partnerId","name"), [partners])
	//#endregion

	//#region [INIT FORM] (Config form)
	const fields: Field[] = useMemo(() => [
		{
			"id": "partnerId",
			"label": "Đối tác",
			"placeholder": "",
			"type": "select",
			"required": true,
			"disabled": false,
			"defaultValue": initialData?.partners?.partnerId || "",
			"colSpan": 1,
			"options": partnerOptions
		},
		{
			"id": "title",
			"label": "Tiêu đề",
			"placeholder": "",
			"type": "text",
			"required": true,
			"disabled": false,
			"defaultValue": initialData?.title || "",
			"colSpan": 1
		}
	], [partnerOptions,initialData])
	//#endregion

	//#region [HANDLE] (chắc chắn đang đc gán vào btn nào đấy)
	const handleSubmit = async (values: Record<string, unknown>) => {

		const contractsrequest: ContractsRequest = {
			partnerId: values["partnerId"] as string,
			userId: "d10d0f02-bc35-4cdc-8005-6cfe1323d9cb",
			title: values["title"] as string,
			status: "PENDING"
		}

		try {
			const res = id
				? await api.put(`/api/contracts/${id}`, contractsrequest)
				: await api.post("/api/contracts", contractsrequest)

			toast.success(id ? "Cập nhật Hợp đồng thành công!" : "Tạo Hợp đồng thành công!")
			console.log("Hợp đồng saved:", res.data)
		} catch (err) {
			console.error("Lỗi khi lưu Hợp đồng:", err)
			toast.error(`Lỗi khi lưu Hợp đồng: ${err}`)
		}
	}
	//#endregion

	return (
		<div className="p-3">
		{id && !initialData ? (
			<p className="opacity-40">Đang tải dữ liệu...</p>
		) : (
			<DynamicForm
				title="Hợp đồng"
				description={id ? "Cập nhật thông tin Hợp đồng" : "Nhập thông tin Hợp đồng mới"}
				fields={fields}
				readOnly={!isEditing} // 🔒 true = chỉ xem, false = cho phép nhập
				onEditClick={() => setIsEditing(!isEditing)} // ✏️ Nhấn “Sửa”
				onSubmit={handleSubmit}
		/>
		)}
	</div>
	)
}
