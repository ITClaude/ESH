import { AdminLayout } from "@/components/AdminLayout";
import { useGetContactMessages, getGetContactMessagesQueryKey, useUpdateContactMessage, useDeleteContactMessage } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Mail, MailOpen, Trash2 } from "lucide-react";
import { useState } from "react";

export default function AdminMessages() {
  const qc = useQueryClient();
  const { data, isLoading } = useGetContactMessages({}, { query: { queryKey: getGetContactMessagesQueryKey({}) } });
  const updateMutation = useUpdateContactMessage({ mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getGetContactMessagesQueryKey({}) }) } });
  const deleteMutation = useDeleteContactMessage({ mutation: { onSuccess: () => qc.invalidateQueries({ queryKey: getGetContactMessagesQueryKey({}) }) } });
  const [selected, setSelected] = useState<any>(null);
  const list = (data as any[]) || [];
  const unread = list.filter((m: any) => !m.isRead).length;

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-6">
          <h1 className="font-serif text-2xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-500 text-sm mt-1">{list.length} message{list.length !== 1 ? "s" : ""} {unread > 0 && <span className="text-red-600 font-medium">({unread} non lu{unread !== 1 ? "s" : ""})</span>}</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List */}
          <div className="lg:col-span-1 bg-white rounded-xl border border-gray-200 overflow-hidden">
            {isLoading ? <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-[hsl(var(--primary))] border-t-transparent rounded-full animate-spin" /></div>
            : list.length === 0 ? <p className="text-center py-16 text-gray-400 text-sm">Aucun message</p>
            : (
              <div className="divide-y divide-gray-100">
                {list.map((m: any) => (
                  <div key={m.id} onClick={() => { setSelected(m); if (!m.isRead) updateMutation.mutate({ id: m.id, data: { isRead: true } }); }} className={`px-4 py-3.5 cursor-pointer hover:bg-gray-50 transition-colors ${selected?.id === m.id ? "bg-[hsl(209,50%,96%)]" : ""}`} data-testid={`message-row-${m.id}`}>
                    <div className="flex items-start gap-2">
                      {m.isRead ? <MailOpen className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" /> : <Mail className="w-4 h-4 text-[hsl(var(--primary))] flex-shrink-0 mt-0.5" />}
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm truncate ${!m.isRead ? "font-semibold text-gray-900" : "text-gray-700"}`}>{m.senderName}</div>
                        <div className="text-xs text-gray-400 truncate">{m.subject || m.message.substring(0, 40)}</div>
                        <div className="text-xs text-gray-300 mt-0.5">{new Date(m.createdAt).toLocaleDateString("fr-RW")}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Detail */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
            {!selected ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <Mail className="w-10 h-10 mb-3 opacity-30" />
                <p className="text-sm">Sélectionnez un message</p>
              </div>
            ) : (
              <div>
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h2 className="font-serif text-lg font-semibold text-gray-900">{selected.subject || "Sans objet"}</h2>
                    <p className="text-sm text-gray-500 mt-1">De: <strong>{selected.senderName}</strong> &lt;{selected.senderEmail}&gt;</p>
                    <p className="text-xs text-gray-400">{new Date(selected.createdAt).toLocaleString("fr-RW")}</p>
                  </div>
                  <button onClick={() => { if (confirm("Supprimer ce message?")) { deleteMutation.mutate({ id: selected.id }); setSelected(null); } }} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded" data-testid="button-delete-message">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="bg-gray-50 rounded-lg p-5 text-sm text-gray-800 leading-relaxed whitespace-pre-wrap" data-testid="message-body">{selected.message}</div>
                <div className="mt-4 flex gap-3">
                  <a href={`mailto:${selected.senderEmail}?subject=Re: ${selected.subject || ""}`} className="px-4 py-2 bg-[hsl(var(--primary))] text-white rounded text-sm font-medium hover:opacity-90 flex items-center gap-2" data-testid="button-reply">
                    <Mail className="w-4 h-4" /> Répondre par Email
                  </a>
                  {!selected.isRead && (
                    <button onClick={() => { updateMutation.mutate({ id: selected.id, data: { isRead: true } }); setSelected({ ...selected, isRead: true }); }} className="px-4 py-2 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50" data-testid="button-mark-read">
                      Marquer comme lu
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
