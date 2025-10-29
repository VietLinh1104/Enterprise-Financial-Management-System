"use client"
import api from "@/lib/axios"
import React, { useMemo } from "react"
import { DynamicForm } from "@/components/ui/dynamic-form"
import type { Field } from "@/components/ui/dynamic-form"
import type { TransactionRequest } from "@/api/swagger/models/TransactionRequest"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Partners, TransactionCategory } from "@/api/swagger"
import { toNameValue } from "@/utils/toNameValue"

export default function GeneratedFormPage() {
	//#region [STATE]
	const router = useRouter();
	const [partners, setPartners] = React.useState<Partners[]>([])
	const [transactionsCategory, setTransactionsCategory] = React.useState<TransactionCategory[]>([])
	//#endregion

	//#region [API FUNCTION] (để tái sử dụng trong Handle functions)
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
	React.useEffect(() => {
		getAllPartners()
		getAllTransactionCategories()
	}
	, [])
	const partnerOptions 				= useMemo(() => toNameValue(partners,"partnerId","name"), [partners])
	const transactionsCategoryOptions 	= useMemo(() => toNameValue(transactionsCategory,"transaction_category_id","name"), [transactionsCategory])
	//#endregion

	//#region [INIT FORM] (Config form)
	const fields: Field[] = useMemo(() => [
		{
			id: "doitac",
			label: "Đối tác",
			type: "select",
			required: false,
			colSpan: 1,
			options: partnerOptions,
		},
		{
			id: "danhMucGiaoDich",
			label: "Danh mục giao dịch",
			type: "select",
			required: true,
			colSpan: 1,
			options: transactionsCategoryOptions,
		},
		{
			id: "amount",
			label: "Số tiền giao dịch",
			type: "number",
			required: true,
			colSpan: 1,
		},
		{
			id: "loaiGiaoDich",
			label: "Loại giao dịch",
			type: "select",
			colSpan: 1,
			required: true,
			options: [
				{ value: "INCOME", name: "Thu" },
				{ value: "EXPENSE", name: "Chi" },
			],
		},
		{
			id: "note",
			label: "Ghi chú",
			type: "textarea",
			colSpan: 1,
		},
		{ id: "attachments", label: "Tệp đính kèm", type: "file", colSpan: 2 },
	], [partnerOptions,transactionsCategoryOptions])
	//#endregion

	//#region [HANDLE] (chắc chắn đang đc gán vào btn nào đấy)
    const handleSubmit = async (values: Record<string, unknown>) => {
		// lấy array attachmentId từ values.attachments
		const attachments = Array.isArray(values.attachments)
		? values.attachments.filter((a): a is { attachmentId: string } => 
			typeof a === "object" && !!a && "attachmentId" in a)
		: []
		const attachmentIds = attachments.map((a) => a.attachmentId)

		// tạo object transactionrequest từ values
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
            const res = await api.post("/api/transactions", transactionrequest)
			toast.success("Tạo giao dịch thành công!")
            console.log("✅ Transaction created:", res.data)
			router.push(`/erp-1/transactions/${res.data.transactionId}`);
        } catch (err) {
			toast.error("Tạo giao dịch thất bại!")
            console.error("❌ Lỗi khi tạo transaction:", err)
			
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
