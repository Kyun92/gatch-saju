"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PixelButton from "@/components/ui/PixelButton";
import PixelFrame from "@/components/ui/PixelFrame";
import PixelSelect from "@/components/ui/PixelSelect";
import { updateCharacter, deleteCharacter } from "@/app/(main)/characters/[id]/actions";

const MBTI_TYPES = [
  "INTJ","INTP","ENTJ","ENTP",
  "INFJ","INFP","ENFJ","ENFP",
  "ISTJ","ISFJ","ESTJ","ESFJ",
  "ISTP","ISFP","ESTP","ESFP",
];

const MBTI_OPTIONS = [
  { value: "", label: "없음" },
  ...MBTI_TYPES.map((m) => ({ value: m, label: m })),
];

interface CharacterActionsProps {
  characterId: string;
  characterName: string;
  mbti: string | null;
  isSelf: boolean;
}

export default function CharacterActions({
  characterId,
  characterName,
  mbti,
  isSelf,
}: CharacterActionsProps) {
  const router = useRouter();
  const [showEdit, setShowEdit] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Edit form state
  const [name, setName] = useState(characterName);
  const [editMbti, setEditMbti] = useState(mbti ?? "");

  async function handleUpdate() {
    setLoading(true);
    setError(null);
    try {
      await updateCharacter(characterId, {
        name,
        mbti: editMbti || null,
      });
      setShowEdit(false);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "수정에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    setLoading(true);
    setError(null);
    try {
      await deleteCharacter(characterId);
      router.push("/");
    } catch (e) {
      setError(e instanceof Error ? e.message : "삭제에 실패했습니다.");
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Action buttons */}
      {!showEdit && !showDeleteConfirm && (
        <div className="flex gap-2">
          <PixelButton
            variant="secondary"
            size="sm"
            onClick={() => setShowEdit(true)}
            className="flex-1"
          >
            편집
          </PixelButton>
          {!isSelf && (
            <PixelButton
              variant="danger"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
              className="flex-1"
            >
              삭제
            </PixelButton>
          )}
        </div>
      )}

      {/* Edit form */}
      {showEdit && (
        <PixelFrame className="p-4">
          <div className="flex flex-col gap-3">
            <div className="pixel-divider mb-1">캐릭터 편집</div>

            <label className="text-xs font-[family-name:var(--font-pixel)] text-[#9a7040]">
              이름
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={20}
              className="w-full px-3 py-2 text-sm font-[family-name:var(--font-pixel)] bg-[#faf7f2] text-[#2c2418] border-2 border-[#b8944c] rounded-none outline-none"
            />

            <label className="text-xs font-[family-name:var(--font-pixel)] text-[#9a7040]">
              MBTI
            </label>
            <PixelSelect
              value={editMbti}
              onChange={setEditMbti}
              options={MBTI_OPTIONS}
              placeholder="없음"
            />

            {error && (
              <p className="text-xs font-[family-name:var(--font-pixel)] text-[#d04040]">
                {error}
              </p>
            )}

            <div className="flex gap-2 mt-1">
              <PixelButton
                variant="secondary"
                size="sm"
                onClick={() => {
                  setShowEdit(false);
                  setName(characterName);
                  setEditMbti(mbti ?? "");
                  setError(null);
                }}
                disabled={loading}
                className="flex-1"
              >
                취소
              </PixelButton>
              <PixelButton
                variant="primary"
                size="sm"
                onClick={handleUpdate}
                disabled={loading || name.trim().length === 0}
                className="flex-1"
              >
                {loading ? "저장 중..." : "저장"}
              </PixelButton>
            </div>
          </div>
        </PixelFrame>
      )}

      {/* Delete confirmation */}
      {showDeleteConfirm && (
        <PixelFrame className="p-4">
          <div className="flex flex-col gap-3">
            <p className="text-sm font-[family-name:var(--font-pixel)] text-[#d04040] text-center">
              정말 삭제하시겠습니까?
            </p>
            <p className="text-xs text-[#8a8070] text-center font-[family-name:var(--font-body)]">
              {characterName}의 모든 차트와 감정 기록이 삭제됩니다.
              이 작업은 되돌릴 수 없습니다.
            </p>

            {error && (
              <p className="text-xs font-[family-name:var(--font-pixel)] text-[#d04040] text-center">
                {error}
              </p>
            )}

            <div className="flex gap-2 mt-1">
              <PixelButton
                variant="secondary"
                size="sm"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setError(null);
                }}
                disabled={loading}
                className="flex-1"
              >
                취소
              </PixelButton>
              <PixelButton
                variant="danger"
                size="sm"
                onClick={handleDelete}
                disabled={loading}
                className="flex-1"
              >
                {loading ? "삭제 중..." : "삭제"}
              </PixelButton>
            </div>
          </div>
        </PixelFrame>
      )}
    </div>
  );
}
