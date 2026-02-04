"use client";

import { useState } from "react";
import { X, Star, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  onReviewSubmitted: () => void;
}

export default function ReviewModal({
  isOpen,
  onClose,
  productId,
  productName,
  onReviewSubmitted,
}: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [author, setAuthor] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!author.trim() || !email.trim() || !title.trim() || !content.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/v1/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          author: author.trim(),
          email: email.trim(),
          rating,
          title: title.trim(),
          content: content.trim(),
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Review submitted successfully!");
        onReviewSubmitted();
        handleClose();
      } else {
        toast.error(data.message || "Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setRating(0);
    setHoverRating(0);
    setAuthor("");
    setEmail("");
    setTitle("");
    setContent("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden shadow-xl animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-(--color-border)">
          <h2 className="text-xl font-semibold">Write a Review</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-(--color-bg-secondary) rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form
          onSubmit={handleSubmit}
          className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]"
        >
          {/* Product Name */}
          <p className="text-sm text-(--color-text-secondary) mb-6">
            Reviewing:{" "}
            <span className="font-medium text-(--color-text)">
              {productName}
            </span>
          </p>

          {/* Rating */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3">
              Your Rating <span className="text-(--color-error)">*</span>
            </label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      star <= (hoverRating || rating)
                        ? "text-(--color-warning) fill-current"
                        : "text-(--color-border)"
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-(--color-text-secondary)">
                {rating > 0
                  ? ["", "Poor", "Fair", "Good", "Very Good", "Excellent"][
                      rating
                    ]
                  : "Select rating"}
              </span>
            </div>
          </div>

          {/* Name & Email Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="author"
                className="block text-sm font-medium mb-2"
              >
                Your Name <span className="text-(--color-error)">*</span>
              </label>
              <input
                type="text"
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="John Doe"
                className="input"
                maxLength={100}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email <span className="text-(--color-error)">*</span>
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="input"
              />
            </div>
          </div>

          {/* Review Title */}
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Review Title <span className="text-(--color-error)">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summarize your experience"
              className="input"
              maxLength={200}
            />
          </div>

          {/* Review Content */}
          <div className="mb-6">
            <label htmlFor="content" className="block text-sm font-medium mb-2">
              Your Review <span className="text-(--color-error)">*</span>
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your experience with this product. What did you like or dislike?"
              rows={4}
              className="input resize-none"
              maxLength={2000}
            />
            <p className="text-xs text-(--color-text-muted) mt-1">
              {content.length}/2000 characters
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="btn btn-secondary flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary flex-1 flex items-center justify-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Review"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
