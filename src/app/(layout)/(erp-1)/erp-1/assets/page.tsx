"use client"

import React, { useEffect, useState } from "react"
import { DataTable } from "@/components/ui/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Trash, Plus, FileDown } from "lucide-react"
import { toast } from "sonner"
import api from "@/lib/axios"
import { useRouter } from "next/navigation"
import { confirmToast } from "@/components/ui/confirm-toast"
import { Assets } from "@/api/swagger/models/Assets"
import { DataTableSkeleton } from "@/components/ui/data-table-skeleton"
import type { SpringPage } from "@/components/ui/data-table" // ⚡ import kiểu SpringPage


const columns: ColumnDef<Assets>[] = [
	{
		accessorKey: "name",
		header: "Tên tài sản",
		cell: ({ row }) => {
			const val = row.getValue("name")
			return val
		}
		},
	{
		accessorKey: "user",
		header: "Người tạo",
		cell: ({ row }) => {
			const user = row.original.user
			return user ? user.fullName || user.username : "—"
		},

		},
	{
		accessorKey: "purchaseDate",
		header: "Ngày mua",
		cell: ({ row }) => {
			const val = row.getValue("purchaseDate")
			return val ? new Date(val as Date).toLocaleDateString() : ""
		}
		},
	{
		accessorKey: "status",
		header: "Trạng thái",
		cell: ({ row }) => {
			const val = row.getValue("status")
			return <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs">{val as string}</span>
		}
		},
	{
		accessorKey: "createdAt",
		header: "Create At",
		cell: ({ row }) => {
			const val = row.getValue("createdAt")
			return val ? new Date(val as Date).toLocaleDateString() : ""
		}
		},
	{
		accessorKey: "updatedAt",
		header: "Update At",
		cell: ({ row }) => {
			const val = row.getValue("updatedAt")
			return val ? new Date(val as Date).toLocaleDateString() : ""
		}
		}
]


// 🧩 Component chính
export default function TransactionListTable() {
	//#region [STATE]
	const [pageData, setPageData] = useState<SpringPage<Assets>>() // ✅ dùng kiểu Page<Transactions>
	const [pageIndex, setPageIndex] = useState(0)
	const [pageSize] = useState(10)
	const [loading, setLoading] = useState(false)
	const [search, setSearch] = useState("")
	const [debouncedSearch, setDebouncedSearch] = useState("")
	const [selected, setSelected] = useState<Assets[]>([])
		const router = useRouter()
	//#endregion

	//#region [API FUNCTION] (để tái sử dụng trong Handle functions)
	async function getAssets(page: number, size: number, search?: string) {
		try {
			toast.loading("Đang tải dữ liệu...")
			const res = await api.get("/api/assets", {
				params: {
					page, // ⚠️ Nếu backend Spring 1-based → dùng page + 1
					size,
					search: search || "",
				},
			})
			setPageData(res.data)
			console.log("Dữ liệu tài sản:", res.data)
		} catch (err) {
			console.error("Lỗi khi load tài sản:", err)
			toast.error("Không thể tải dữ liệu tài sản")
		} finally {
			toast.dismiss()
		}
	}

		async function deleteListPartners(objIds: string[]) {
		try {
			await api.delete("/api/assets/batch-delete", { data: objIds })
			toast.success(`Đã xóa ${objIds.length} đối tác`)
			await getAssets(pageIndex, pageSize, debouncedSearch)
			} catch (err) {
				console.error("❌ Lỗi khi xóa:", err)
				toast.error("Không thể xóa tài sản")
			}
	}

		async function deletePartner(id: string) {
		try {
			await api.delete(`/api/assets/${id}`)
			toast.success(`Đã xóa tài sản với ID: ${id}`)
			await getAssets(pageIndex, pageSize, debouncedSearch)
			} catch (err) {
				console.error("❌ Lỗi khi xóa:", err)
				toast.error(`Không thể xóa tài sản Error: ${err}`)
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
		getAssets(pageIndex, pageSize, debouncedSearch).finally(() =>
			setLoading(false)
		)
	}, [pageIndex, debouncedSearch, pageSize])
	//#endregion

	//#region [HANDLE] (chắc chắn đang đc gán vào btn nào đấy) 
		const handleDeleteSelected = React.useCallback(async () => {
			// Lấy danh sách transactionId đã chọn
			const objIds = selected
				.map((t) => t.assetId)
				.filter((id): id is string => !!id)

			console.log("🧾 Các transactionId đã chọn:", objIds)

			if (objIds.length === 0) {
				toast.info("Không có giao dịch nào để xóa")
				return
			}

			confirmToast({
				title: "Xóa giao dịch?",
				description: "Hành động này sẽ xóa vĩnh viễn dữ liệu.",
				confirmText: "Xóa",
				onConfirm: async () => {
					await deleteListPartners(objIds);
				},
			})
		}, [selected])

	const handleDelete = async (id: number | string) => {
		confirmToast({
			title: "Xóa giao dịch?",
			description: "Hành động này sẽ xóa vĩnh viễn dữ liệu.",
			confirmText: "Xóa",
			onConfirm: async () => {
				await deletePartner(id as string)
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
				href: "/erp-1/assets/new",
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
				href: "/erp-1/assets/:id",
			},
			{
				label: "Xóa",
				onClick: (row: Assets) =>
					handleDelete((row as Assets).assetId as string),
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
				<DataTable<Assets, unknown>
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
						router.push(`/erp-1/assets/${row.assetId}`)
					}
				/>
			)}
		</div>
	)
}
