"use client"
import api from "@/lib/axios"
import React, { useMemo } from "react"
import { DynamicForm } from "@/components/ui/dynamic-form"
import type { Field } from "@/components/ui/dynamic-form"
import type { ContractsRequest } from "@/api/swagger/models/ContractsRequest"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Partners } from "@/api/swagger"
import { toNameValue } from "@/utils/toNameValue"

export default function GeneratedFormPage() {
	//#region [STATE]
	const router = useRouter();
	const [partners, setPartners] = React.useState<Partners[]>([])
	
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
	//#endregion

	//#region [LOADING DATA] (chạy ngay khi tải trang hoặc có event)
	React.useEffect(() => {
		getAllPartners()
	}
	, [])
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
			"defaultValue": "",
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
			"defaultValue": "",
			"colSpan": 1
		}
	], [partnerOptions])
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
            const res = await api.post("/api/contracts", contractsrequest)
			toast.success("Tạo hợp đồng thành công!")
            console.log("hợp đồng created:", res.data)
			router.push(`/erp-1/contracts/${res.data.contractId}`);
        } catch (err) {
			toast.error("Tạo hợp đồng thất bại!")
            console.error("Lỗi khi tạo hợp đồng:", err)
			
        }
    }
	//#endregion

	return (
		<div className="p-1.5">
			<DynamicForm
				title="Hợp đồng"
				description="Nhập thông tin giao dịch mới"
				fields={fields}
				onSubmit={handleSubmit}
			/>
		</div>
	)
}
