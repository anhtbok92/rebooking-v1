"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { useNews, createNews, updateNews, deleteNews, type News } from "@/lib/swr"
import { Newspaper, Plus, Edit, Trash2, Eye, EyeOff, Search } from "lucide-react"
import { format } from "date-fns"

export function NewsManagement() {
	const [page, setPage] = useState(1)
	const [search, setSearch] = useState("")
	const [category, setCategory] = useState<string>("ALL")
	const [publishedFilter, setPublishedFilter] = useState<string>("ALL")
	
	const { data, mutate, isLoading } = useNews({
		page,
		limit: 10,
		search: search || undefined,
		category: category !== "ALL" ? category : undefined,
		published: publishedFilter === "ALL" ? undefined : publishedFilter === "PUBLISHED",
	})
	
	const news = data?.news || []
	const pagination = data?.pagination
	
	const [dialogOpen, setDialogOpen] = useState(false)
	const [editingNews, setEditingNews] = useState<News | null>(null)
	const [formData, setFormData] = useState({
		title: "",
		slug: "",
		excerpt: "",
		content: "",
		coverImage: "",
		category: "NEWS" as "NEWS" | "PROMOTION" | "EVENT",
		tags: [] as string[],
		published: false,
	})
	const [isSaving, setIsSaving] = useState(false)

	const handleCreate = () => {
		setEditingNews(null)
		setFormData({
			title: "",
			slug: "",
			excerpt: "",
			content: "",
			coverImage: "",
			category: "NEWS",
			tags: [],
			published: false,
		})
		setDialogOpen(true)
	}

	const handleEdit = (newsItem: News) => {
		setEditingNews(newsItem)
		setFormData({
			title: newsItem.title,
			slug: newsItem.slug,
			excerpt: newsItem.excerpt || "",
			content: newsItem.content,
			coverImage: newsItem.coverImage || "",
			category: newsItem.category,
			tags: newsItem.tags,
			published: newsItem.published,
		})
		setDialogOpen(true)
	}

	const handleSave = async () => {
		if (!formData.title || !formData.slug || !formData.content) {
			toast.error("Vui lòng điền đầy đủ thông tin bắt buộc")
			return
		}

		setIsSaving(true)
		try {
			if (editingNews) {
				await updateNews(editingNews.id, formData)
				toast.success("Đã cập nhật tin tức")
			} else {
				await createNews(formData)
				toast.success("Đã tạo tin tức mới")
			}
			mutate()
			setDialogOpen(false)
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra")
		} finally {
			setIsSaving(false)
		}
	}

	const handleDelete = async (id: string, title: string) => {
		if (!confirm(`Bạn có chắc muốn xóa "${title}"?`)) return

		try {
			await deleteNews(id)
			toast.success("Đã xóa tin tức")
			mutate()
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Không thể xóa tin tức")
		}
	}

	const generateSlug = (title: string) => {
		return title
			.toLowerCase()
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "")
			.replace(/đ/g, "d")
			.replace(/[^a-z0-9\s-]/g, "")
			.trim()
			.replace(/\s+/g, "-")
	}

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h2 className="text-2xl font-bold">Quản Lý Tin Tức</h2>
				<Button onClick={handleCreate} className="gap-2">
					<Plus className="w-4 h-4" />
					Tạo tin tức
				</Button>
			</div>

			{/* Filters */}
			<Card>
				<CardContent className="pt-6">
					<div className="flex flex-wrap gap-4">
						<div className="flex-1 min-w-[200px]">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
								<Input
									placeholder="Tìm kiếm..."
									value={search}
									onChange={(e) => {
										setSearch(e.target.value)
										setPage(1)
									}}
									className="pl-9"
								/>
							</div>
						</div>
						<Select value={category} onValueChange={(v) => { setCategory(v); setPage(1) }}>
							<SelectTrigger className="w-[180px]">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="ALL">Tất cả danh mục</SelectItem>
								<SelectItem value="NEWS">Tin tức</SelectItem>
								<SelectItem value="PROMOTION">Ưu đãi</SelectItem>
								<SelectItem value="EVENT">Sự kiện</SelectItem>
							</SelectContent>
						</Select>
						<Select value={publishedFilter} onValueChange={(v) => { setPublishedFilter(v); setPage(1) }}>
							<SelectTrigger className="w-[180px]">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="ALL">Tất cả trạng thái</SelectItem>
								<SelectItem value="PUBLISHED">Đã xuất bản</SelectItem>
								<SelectItem value="DRAFT">Bản nháp</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</CardContent>
			</Card>

			{/* News List */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Newspaper className="w-5 h-5" />
						Danh Sách Tin Tức
					</CardTitle>
					<CardDescription>
						{pagination?.total || 0} tin tức
					</CardDescription>
				</CardHeader>
				<CardContent>
					{isLoading ? (
						<div className="text-center py-8">Đang tải...</div>
					) : news.length === 0 ? (
						<div className="text-center py-8 text-muted-foreground">
							Chưa có tin tức nào
						</div>
					) : (
						<div className="space-y-4">
							{news.map((item) => (
								<div
									key={item.id}
									className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition"
								>
									{item.coverImage && (
										<img
											src={item.coverImage}
											alt={item.title}
											className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
										/>
									)}
									<div className="flex-1 min-w-0">
										<div className="flex items-start justify-between gap-2 mb-2">
											<div className="flex-1">
												<h3 className="font-semibold text-lg line-clamp-1">{item.title}</h3>
												<p className="text-sm text-muted-foreground line-clamp-2 mt-1">
													{item.excerpt || item.content.substring(0, 100) + "..."}
												</p>
											</div>
											<div className="flex items-center gap-2 flex-shrink-0">
												<Button
													variant="ghost"
													size="sm"
													onClick={() => handleEdit(item)}
												>
													<Edit className="w-4 h-4" />
												</Button>
												<Button
													variant="ghost"
													size="sm"
													onClick={() => handleDelete(item.id, item.title)}
												>
													<Trash2 className="w-4 h-4 text-destructive" />
												</Button>
											</div>
										</div>
										<div className="flex items-center gap-2 flex-wrap">
											<Badge variant={item.published ? "default" : "secondary"}>
												{item.published ? (
													<><Eye className="w-3 h-3 mr-1" /> Đã xuất bản</>
												) : (
													<><EyeOff className="w-3 h-3 mr-1" /> Bản nháp</>
												)}
											</Badge>
											<Badge variant="outline">{item.category}</Badge>
											<span className="text-xs text-muted-foreground">
												{item.viewCount} lượt xem
											</span>
											{item.publishedAt && (
												<span className="text-xs text-muted-foreground">
													{format(new Date(item.publishedAt), "dd/MM/yyyy")}
												</span>
											)}
										</div>
									</div>
								</div>
							))}
						</div>
					)}

					{/* Pagination */}
					{pagination && pagination.pages > 1 && (
						<div className="flex items-center justify-between mt-6 pt-6 border-t">
							<p className="text-sm text-muted-foreground">
								Trang {pagination.page} / {pagination.pages}
							</p>
							<div className="flex gap-2">
								<Button
									variant="outline"
									size="sm"
									onClick={() => setPage(Math.max(1, page - 1))}
									disabled={page === 1}
								>
									Trước
								</Button>
								<Button
									variant="outline"
									size="sm"
									onClick={() => setPage(Math.min(pagination.pages, page + 1))}
									disabled={page === pagination.pages}
								>
									Sau
								</Button>
							</div>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Create/Edit Dialog */}
			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>
							{editingNews ? "Chỉnh Sửa Tin Tức" : "Tạo Tin Tức Mới"}
						</DialogTitle>
						<DialogDescription>
							Điền thông tin tin tức bên dưới
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-4">
						<div>
							<Label htmlFor="title">Tiêu đề *</Label>
							<Input
								id="title"
								value={formData.title}
								onChange={(e) => {
									setFormData({ ...formData, title: e.target.value })
									if (!editingNews) {
										setFormData(prev => ({ ...prev, slug: generateSlug(e.target.value) }))
									}
								}}
								placeholder="Nhập tiêu đề"
							/>
						</div>
						<div>
							<Label htmlFor="slug">Slug *</Label>
							<Input
								id="slug"
								value={formData.slug}
								onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
								placeholder="tin-tuc-moi"
							/>
						</div>
						<div>
							<Label htmlFor="excerpt">Mô tả ngắn</Label>
							<RichTextEditor
								value={formData.excerpt}
								onChange={(value) => setFormData({ ...formData, excerpt: value })}
								placeholder="Mô tả ngắn gọn về tin tức (hiển thị trên trang chủ)"
								minHeight="120px"
							/>
							<p className="text-xs text-muted-foreground mt-1">
								Mô tả này sẽ hiển thị trên trang chủ. Nên giữ ngắn gọn.
							</p>
						</div>
						<div>
							<Label htmlFor="content">Nội dung *</Label>
							<RichTextEditor
								value={formData.content}
								onChange={(value) => setFormData({ ...formData, content: value })}
								placeholder="Nội dung chi tiết của bài viết. Bạn có thể copy/paste từ web, thêm hình ảnh, link..."
								minHeight="300px"
							/>
							<p className="text-xs text-muted-foreground mt-1">
								Hỗ trợ: Bold, Italic, Heading, List, Quote, Code, Link, Image
							</p>
						</div>
						<div>
							<Label htmlFor="coverImage">Ảnh bìa (URL)</Label>
							<Input
								id="coverImage"
								value={formData.coverImage}
								onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
								placeholder="https://example.com/image.jpg"
							/>
							{formData.coverImage && (
								<div className="mt-2">
									<img 
										src={formData.coverImage} 
										alt="Preview" 
										className="w-full max-w-xs h-auto rounded-lg border"
										onError={(e) => {
											e.currentTarget.style.display = 'none'
										}}
									/>
								</div>
							)}
						</div>
						<div>
							<Label htmlFor="category">Danh mục</Label>
							<Select
								value={formData.category}
								onValueChange={(v: any) => setFormData({ ...formData, category: v })}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="NEWS">Tin tức</SelectItem>
									<SelectItem value="PROMOTION">Ưu đãi</SelectItem>
									<SelectItem value="EVENT">Sự kiện</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="flex items-center gap-2">
							<input
								type="checkbox"
								id="published"
								checked={formData.published}
								onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
								className="w-4 h-4"
							/>
							<Label htmlFor="published" className="cursor-pointer">
								Xuất bản ngay
							</Label>
						</div>
						<div className="flex gap-2 justify-end">
							<Button variant="outline" onClick={() => setDialogOpen(false)}>
								Hủy
							</Button>
							<Button onClick={handleSave} disabled={isSaving}>
								{isSaving ? "Đang lưu..." : "Lưu"}
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	)
}
