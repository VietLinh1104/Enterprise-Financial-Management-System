"use client"

import { useParams } from "next/navigation"
import api from "@/lib/axios"
import React, { useEffect, useMemo, useState } from "react"
import { DynamicForm } from "@/components/ui/dynamic-form"
import type { Field } from "@/components/ui/dynamic-form"
import type { TransactionRequest } from "@/api/swagger/models/TransactionRequest"
import { toast } from "sonner"
import { Attachments, Partners, TransactionCategory, TransactionResponse } from "@/api/swagger"
import { toNameValue } from "@/utils/toNameValue"


export default function GeneratedFormPage() {
	//#region [STATE]
	// Lấy param [id] từ URL (ví dụ /transactions/123)
	const params = useParams()
	const id = params?.id as string | undefined

	const [initialData, setInitialData] = useState<TransactionResponse| null>(null)
	const [isEditing, setIsEditing] = useState<boolean>(!id)
	const [partners, setPartners] = React.useState<Partners[]>([])
	const [transactionsCategory, setTransactionsCategory] = React.useState<TransactionCategory[]>([])
	
	//#endregion

	//#region [API FUNCTION] (để tái sử dụng trong Handle functions)
	async function getTransactionById(id: string) {
		try {
			console.log("📡 Gọi API lấy giao dịch với ID:", id)
			const res = await api.get(`/api/transactions/${id}`)
			setInitialData(res.data)
			console.log("✅ Dữ liệu giao dịch:", res.data)
		} catch (err) {
			console.error("❌ Lỗi khi load giao dịch:", err )
			toast.error("Không thể tải dữ liệu giao dịch")
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

	async function getAllTransactionCategories() {
		try {
			const res = await api.get(`/api/transaction-category/all`)
			setTransactionsCategory(res.data)
			console.log("Dữ liệu danh muc giao dich:", res)
		} catch (err) {
			console.error("Lỗi khi load danh muc giao dich:", err )
			toast.error("Không thể tải dữ liệu danh muc giao dich")
		}
	}
	//#endregion

	//#region [LOADING DATA] (chạy ngay khi tải trang hoặc có event)
	useEffect(() => {
		console.log("🟡 ID param nhận được:", id)
		if (id) getTransactionById(id)
	}, [id])

	React.useEffect(() => {
		getAllPartners()
		getAllTransactionCategories()
	}
	, [])
	const partnerOptions 				= useMemo(() => toNameValue(partners,"partnerId","name"), [partners])
	const transactionsCategoryOptions 	= useMemo(() => toNameValue(transactionsCategory,"transaction_category_id","name"), [transactionsCategory])
	
	//#endregion

	//#region [HANDLE] (chắc chắn đang đc gán vào btn nào đấy)
	const handleSubmit = async (values: Record<string, unknown>) => {

		// lấy array attachmentId từ values.attachments
		const attachments = Array.isArray(values.attachments)
			? values.attachments.filter((a): a is { attachmentId: string } =>
				typeof a === "object" && !!a && "attachmentId" in a)
			: []
		const attachmentIds = attachments.map((a) => a.attachmentId)

		// tạo object transactionrequest từ values và gán dèfault
		const transactionrequest: TransactionRequest = {
			userId: "d10d0f02-bc35-4cdc-8005-6cfe1323d9cb", 
			partnerId: values["doitac"] as string,
			transactionCategoryId: values["danhMucGiaoDich"] as string,
			amount: Number(values["amount"]) || 0,
			transactionType: values["loaiGiaoDich"] as string,
			status: "PENDING",
			note: values["note"] as string,
			attachment_id: attachmentIds,
		}

		// gửi request tạo transaction
		try {
			const res = id
				? await api.put(`/api/transactions/${id}`, transactionrequest)
				: await api.post("/api/transactions", transactionrequest)

			toast.success(id ? "Cập nhật giao dịch thành công!" : "Tạo giao dịch thành công!")
			console.log("Transaction saved:", res.data)
		} catch (err) {
			console.error("❌ Lỗi khi lưu giao dịch:", err)
			toast.error(`Lỗi khi lưu giao dịch: ${err}`)
		}
	}
	//#endregion

	//#region [INIT FORM] (Config form)
	const fields: Field[] = useMemo(() => [
		{
			id: "doitac",
			label: "Đối tác",
			type: "select",
			colSpan: 1,
			required: false,
			options: partnerOptions,
			defaultValue: initialData?.partner?.partnerId ?? "",
		},
		{
			id: "danhMucGiaoDich",
			label: "Danh mục giao dịch",
			type: "select",
			required: true,
			colSpan: 1,
			options: transactionsCategoryOptions,
			defaultValue: initialData?.transactionCategory?.transaction_category_id ?? "",
		},
		{
			id: "amount",
			label: "Số tiền giao dịch",
			type: "number",
			required: true,
			colSpan: 1,
			defaultValue: initialData?.amount ?? 0,
		},
		{
			id: "loaiGiaoDich",
			label: "Loại giao dịch",
			type: "select",
			colSpan: 1,
			options: [
				{ value: "INCOME", name: "Thu" },
				{ value: "EXPENSE", name: "Chi" },
			],
			defaultValue: initialData?.transactionType ?? "INCOME",
		},
		{
			id: "note",
			label: "Ghi chú",
			type: "textarea",
			colSpan: 2,
			defaultValue: initialData?.note ?? "",
		},
		{
			id: "attachments",
			label: "Tệp đính kèm",
			type: "file",
		disable: true,
			colSpan: 2,
			defaultValue: (initialData?.attachmentsList as Attachments[]) ?? [],
			},
	], [initialData,partnerOptions,transactionsCategoryOptions])
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
