export default function InboxPage() {
    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">Inbox</h2>

            {/* Empty State */}
            <div className="text-center py-12">
                <div className="text-6xl mb-4">📧</div>
                <h3 className="text-2xl font-semibold mb-4">No messages</h3>
                <p className="text-gray-600">
                    You don't have any messages yet. We'll notify you here when you receive updates about your orders.
                </p>
            </div>
        </div>
    );
}

