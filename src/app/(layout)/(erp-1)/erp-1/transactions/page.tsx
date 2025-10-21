"use client"

import React, { useEffect, useState } from "react"
import { DataTable } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Trash, Plus, FileDown } from "lucide-react"
import { Transactions } from "@/api/swagger/models/Transactions"
import { toast } from "sonner"
import api from "@/lib/axios"
import { useRouter } from "next/navigation"
import { confirmToast } from "@/components/ui/confirm-toast"

import type { SpringPage } from "@/components/ui/data-table" // ⚡ import kiểu SpringPage
import { DataTableSkeleton } from "@/components/ui/data-table-skeleton"

// [INIT COLUMN]
const columns: ColumnDef<Transactions>[] = [
	{
		accessorKey: "partner.name",
		header: "Đối tác",
		cell: ({ row }) => row.original.partner?.name ?? "—",
	},
	{
		accessorKey: "transactionCategory.name",
		header: "Danh mục giao dịch",
		cell: ({ row }) => row.original.transactionCategory?.name ?? "—",
	},
	{
		accessorKey: "amount",
		header: "Số tiền",
		cell: ({ row }) => {
			const val = row.original.amount ?? 0
			return val.toLocaleString("vi-VN")
		},
	},
	{
		accessorKey: "transactionType",
		header: "Loại giao dịch",
		cell: ({ row }) => (row.original.transactionType === "INCOME" ? "Thu" : "Chi"),
	},
	{
		accessorKey: "status",
		header: "Trạng thái",
		cell: ({ row }) => {
			const val = row.original.status
			return (
				<span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs">
					{val as string}
				</span>
			)
		},
	},
	{
		accessorKey: "createdAt",
		header: "Ngày tạo",
		cell: ({ row }) =>
			row.original.createdAt
				? new Date(row.original.createdAt).toLocaleDateString("vi-VN")
				: "",
	},
	{
		accessorKey: "updatedAt",
		header: "Ngày cập nhật",
		cell: ({ row }) =>
			row.original.updatedAt
				? new Date(row.original.updatedAt).toLocaleDateString("vi-VN")
				: "",
	},
]

// 🧩 Component chính
export default function TransactionListTable() {
	//#region [STATE]
	const [pageData, setPageData] = useState<SpringPage<Transactions>>() // ✅ dùng kiểu Page<Transactions>
	const [pageIndex, setPageIndex] = useState(0)
	const [pageSize] = useState(10)
	const [loading, setLoading] = useState(false)
	const [search, setSearch] = useState("")
	const [debouncedSearch, setDebouncedSearch] = useState("")
	const [selected, setSelected] = useState<Transactions[]>([])
    const router = useRouter()
	//#endregion

	//#region [API FUNCTION] (để tái sử dụng trong Handle functions)
	// get Page dữ liệu
	async function getTransactions(page: number, size: number, search?: string) {
		try {
			toast.loading("Đang tải dữ liệu...")
			const res = await api.get("/api/transactions", {
				params: {
					page, // ⚠️ Nếu backend Spring 1-based → dùng page + 1
					size,
					search: search || "",
				},
			})
			setPageData(res.data)
			console.log("✅ Dữ liệu giao dịch:", res.data)
		} catch (err) {
			console.error("❌ Lỗi khi load giao dịch:", err)
			toast.error("Không thể tải dữ liệu giao dịch")
		} finally {
			toast.dismiss()
		}
	}

	// xóa nhiều transaction
    async function deleteListTransaction(transactionIds: string[]) {
		try {
            await api.delete("/api/transactions/batch-delete", { data: transactionIds })
            toast.success(`Đã xóa ${transactionIds.length} giao dịch`)
            await getTransactions(pageIndex, pageSize, debouncedSearch)
        } catch (err) {
            console.error("❌ Lỗi khi xóa:", err)
            toast.error("Không thể xóa giao dịch")
        }
	}

	// xóa 1 transaction
    async function deleteTransaction(id: string) {
		try {
            await api.delete(`/api/transactions/${id}`)
            toast.success(`Đã xóa giao dịch với ID: ${id}`)
            await getTransactions(pageIndex, pageSize, debouncedSearch)
        } catch (err) {
            console.error("❌ Lỗi khi xóa:", err)
            toast.error(`Không thể xóa giao dịch Error: ${err}`)
        }
	}
	//#endregion

	//#region [LOADING DATA] (chạy ngay khi tải trang hoặc có event)
	useEffect(() => {
		const t = setTimeout(() => setDebouncedSearch(search.trim()), 400)
		return () => clearTimeout(t)
	}, [search])

	useEffect(() => {
		setLoading(true)
		getTransactions(pageIndex, pageSize, debouncedSearch).finally(() =>
			setLoading(false)
		)
	}, [pageIndex, debouncedSearch, pageSize])
	//#endregion

	//#region [HANDLE] (chắc chắn đang đc gán vào btn nào đấy) 
    const handleDeleteSelected = React.useCallback(async () => {
        // Lấy danh sách transactionId đã chọn
        const transactionIds = selected
            .map((t) => t.transactionId)
            .filter((id): id is string => !!id)

        console.log("🧾 Các transactionId đã chọn:", transactionIds)

        if (transactionIds.length === 0) {
            toast.info("Không có giao dịch nào để xóa")
            return
        }

        confirmToast({
            title: "Xóa giao dịch?",
            description: "Hành động này sẽ xóa vĩnh viễn dữ liệu.",
            confirmText: "Xóa",
            onConfirm: async () => {
                await deleteListTransaction(transactionIds);
            },
        })
    }, [selected])

	const handleDelete = async (id: number | string) => {
        confirmToast({
            title: "Xóa giao dịch?",
            description: "Hành động này sẽ xóa vĩnh viễn dữ liệu.",
            confirmText: "Xóa",
            onConfirm: async () => {
                await deleteTransaction(id as string)
            },
        })
		
	}

	const handleExportCSV = () => {
        toast.info("Chức năng xuất CSV chưa làm xong :))) từ từ")
	}
	//#endregion

	//#region [INIT TABLE] (Toolbar & Row actions)
	const toolbarActions = React.useMemo(() => {
		const base = [
			{
				label: "Thêm mới",
				href: "/erp-1/transactions/new",
				icon: <Plus className="h-4 w-4" />,
			},
			{
				label: "Xuất CSV",
				onClick: handleExportCSV,
				icon: <FileDown className="h-4 w-4" />,
				variant: "secondary" as const,
			},
		]
		if (selected.length > 0) {
			base.push({
				label: `Xóa (${selected.length})`,
				onClick: handleDeleteSelected,
				variant: "secondary" as const,
				icon: <Trash className="h-4 w-4" />,
			})
		}
		return base
	}, [selected, handleDeleteSelected])

	const rowActions = React.useMemo(
		() => [
			{
				label: "Sửa",
				href: "/erp-1/transactions/:id",
			},
			{
				label: "Xóa",
				onClick: (row: Transactions) =>
					handleDelete((row as Transactions).transactionId as string),
				variant: "destructive" as const,
			},
		],
		[]
	)
	//#endregion

	return (
		<div className="p-2">
			{loading || !pageData ? (
				<DataTableSkeleton
					columns={5}
					rows={10}
					toolbarActions={toolbarActions} // 🔥 Truyền y hệt toolbar chính
				/>
			) : (
				<DataTable<Transactions, unknown>
					columns={columns}
					pageData={pageData} // ✅ dùng đúng prop
					onPageChange={setPageIndex}
					withCheckbox
					searchValue={search}
					onSearchChange={setSearch}
					onSelectionChange={setSelected}
					toolbarActions={toolbarActions}
					actions={rowActions}
					onRowClick={(row) =>
						router.push(`/erp-1/transactions/${row.transactionId}`)
					}
				/>
			)}
		</div>
	)
}
