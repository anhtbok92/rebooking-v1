"use client"

import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronLeft, ChevronRight, History, Trash2, Upload, X } from "lucide-react"
import { CldUploadWidget } from "next-cloudinary"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"

interface Image {
	secure_url: string
	public_id: string
	created_at?: string
}

interface PhotoUploadProps {
	photos: string[]
	setPhotos: (photos: string[]) => void
}

export function PhotoUpload({ photos, setPhotos }: PhotoUploadProps) {
	const [previousImages, setPreviousImages] = useState<Image[]>([])
	const [selectedImages, setSelectedImages] = useState<string[]>([])
	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const [isFetching, setIsFetching] = useState(false)
	const [nextCursor, setNextCursor] = useState<string | null>(null)
	const [prevCursors, setPrevCursors] = useState<(string | null)[]>([null])

	const uploadPreset = "jobtree"

	const fetchImages = useCallback(async (cursor: string | null = null, isPrev = false) => {
		setIsFetching(true)
		try {
			const res = await fetch(`/api/v1/cloudinary${cursor ? `?next_cursor=${cursor}` : ""}`)
			if (!res.ok) throw new Error("Failed to fetch images")
			const { images = [], nextCursor } = await res.json()
			setPreviousImages(
				images.sort((a: Image, b: Image) => new Date(b.created_at || "").getTime() - new Date(a.created_at || "").getTime())
			)
			setNextCursor(nextCursor || null)
			setPrevCursors((prev) => (isPrev ? prev.slice(0, -1) : cursor ? [...prev, cursor] : [null]))
		} catch (err) {
			toast.error("Failed to load images")
			setPreviousImages([])
			setNextCursor(null)
		} finally {
			setIsFetching(false)
		}
	}, [])

	const handleImageUpload = useCallback(
		(result: any) => {
			if (result.event === "success" && result.info) {
				const info = typeof result.info === "string" ? { secure_url: result.info } : result.info
				if (info.secure_url) {
					if (photos.length >= 5) {
						toast.error("Maximum 5 images allowed")
						return
					}
					const newImageUrl = info.secure_url
					setPhotos([...photos, newImageUrl])
					toast.success("Image uploaded successfully!")
				}
			} else if (result.event === "error") {
				toast.error("Upload failed")
			}
		},
		[photos, setPhotos]
	)

	const removePhoto = useCallback(
		(index: number) => {
			const newPhotos = photos.filter((_, i) => i !== index)
			setPhotos(newPhotos)
			toast.success("Photo removed")
		},
		[photos, setPhotos]
	)

	const handleReuseImage = useCallback(
		(image: Image) => {
			if (photos.length >= 5) {
				toast.error("Maximum 5 images allowed")
				return
			}
			if (photos.includes(image.secure_url)) {
				toast.error("This image is already added")
				return
			}
			setPhotos([...photos, image.secure_url])
			toast.success("Image added!")
		},
		[photos, setPhotos]
	)

	const toggleSelectImage = (publicId: string) =>
		setSelectedImages((prev) =>
			prev.includes(publicId) ? prev.filter((id) => id !== publicId) : [...prev, publicId]
		)

	const toggleSelectAll = () =>
		setSelectedImages(
			selectedImages.length === previousImages.length ? [] : previousImages.map((img) => img.public_id)
		)

	const handleDeleteImages = async (ids: string[]) => {
		try {
			const res = await fetch("/api/v1/cloudinary", {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ publicIds: ids }),
			})
			if (!res.ok) throw new Error("Delete failed")
			setPreviousImages((prev) => prev.filter((img) => !ids.includes(img.public_id)))
			setSelectedImages((prev) => prev.filter((id) => !ids.includes(id)))
			toast.success(`${ids.length} image(s) deleted.`)
		} catch (err) {
			toast.error("Delete failed")
		}
	}

	useEffect(() => {
		if (isDialogOpen) {
			fetchImages()
		}
	}, [isDialogOpen, fetchImages])

	return (
		<div className="bg-card rounded-lg p-6 border border-border w-full">
			<div className="space-y-4">
				<CldUploadWidget
					onSuccess={handleImageUpload}
					uploadPreset={uploadPreset}
					options={{ maxFiles: 1, folder: "jobtree" }}
				>
					{({ open }) => (
						<div
							onClick={() => {
								if (photos.length >= 5) {
									toast.error("Maximum 5 images allowed")
									return
								}
								open?.()
							}}
							className="relative border-2 border-dashed rounded-lg p-6 transition-colors border-border bg-muted/30 hover:border-primary/50 cursor-pointer flex flex-col items-center justify-center"
						>
							<Upload className="w-6 h-6 text-primary mb-2" />
							<p
								className="text-sm text-card-foreground font-medium mb-1"
								style={{ fontFamily: "var(--font-dm-sans)" }}
							>
								Click to upload images
							</p>
							<p className="text-xs text-muted-foreground">Max 5 images ({photos.length}/5)</p>
						</div>
					)}
				</CldUploadWidget>

				{photos.length > 0 && (
					<div className="grid grid-cols-5 gap-3">
						{photos.map((photoUrl, index) => (
							<div key={index} className="relative group">
								<div className="aspect-square rounded-lg overflow-hidden bg-muted border border-border">
									<img
										src={photoUrl}
										alt={`Inspiration ${index + 1}`}
										className="w-full h-full object-cover"
									/>
								</div>
								<button
									onClick={() => removePhoto(index)}
									className="absolute top-1 right-1 p-1 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
								>
									<X className="w-3 h-3" />
								</button>
							</div>
						))}
					</div>
				)}

				<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
					<DialogTrigger asChild>
						<Button variant="outline" size="sm" className="w-full gap-2">
							<History className="w-4 h-4" /> Browse Gallery
						</Button>
					</DialogTrigger>
					<DialogContent className="sm:max-w-[700px] p-4 bg-white dark:bg-gray-800 rounded-xl">
						<DialogHeader className="flex flex-col gap-2">
							<DialogTitle>Gallery</DialogTitle>
						</DialogHeader>
						{isFetching ? (
							<div className="flex justify-center items-center h-40">
								<div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
							</div>
						) : previousImages.length === 0 ? (
							<div className="text-center text-gray-500 py-8">No images uploaded yet.</div>
						) : (
							<div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-h-[400px] overflow-y-auto p-2">
								{previousImages.map((image, index) => (
									<div
										key={image.public_id}
										className="relative rounded-lg overflow-hidden group transition border border-gray-200 dark:border-gray-600"
									>
										<Avatar className="w-full aspect-square rounded-lg overflow-hidden">
											<AvatarImage
												src={image.secure_url}
												alt={`Image ${index + 1}`}
												className="object-cover h-full w-full"
											/>
											<AvatarFallback>Img</AvatarFallback>
										</Avatar>
										<div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-25 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
											<Button
												variant="secondary"
												size="sm"
												className="text-white bg-blue-500 hover:bg-blue-600"
												onClick={() => handleReuseImage(image)}
												disabled={photos.includes(image.secure_url) || photos.length >= 5}
											>
												{photos.includes(image.secure_url) ? "Added" : "Add"}
											</Button>
										</div>
									</div>
								))}
							</div>
						)}
						<div className="flex justify-between items-center gap-4 mt-4">
							<div className="flex items-center gap-2">
								{previousImages.length > 0 && (
									<label className="flex items-center gap-1 text-sm cursor-pointer">
										<input
											type="checkbox"
											checked={selectedImages.length === previousImages.length}
											onChange={toggleSelectAll}
										/>
										Select All
									</label>
								)}
								{selectedImages.length > 0 && (
									<Button
										variant="destructive"
										size="sm"
										onClick={() => handleDeleteImages(selectedImages)}
									>
										Delete ({selectedImages.length})
									</Button>
								)}
							</div>
							<div className="flex gap-4">
								<Button
									variant="outline"
									size="sm"
									disabled={prevCursors.length <= 1 || isFetching}
									onClick={() => fetchImages(prevCursors[prevCursors.length - 2], true)}
								>
									<ChevronLeft className="w-4 h-4" /> Prev
								</Button>
								<Button
									variant="outline"
									size="sm"
									disabled={!nextCursor || isFetching}
									onClick={() => fetchImages(nextCursor)}
								>
									Next <ChevronRight className="w-4 h-4" />
								</Button>
							</div>
						</div>
					</DialogContent>
				</Dialog>
			</div>
		</div>
	)
}
