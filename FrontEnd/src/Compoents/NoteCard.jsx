export default function NoteCard({
  title,
  content,
  noteType,
  handleEdit,
  handleDelet,
  onOpen
}) {
  return (
    <div
      onClick={onOpen}
      className="card relative hover:shadow-md hover:shadow-zinc-900/80 p-2.5 rounded-xl w-72 h-52 shadow text-white text-md bg-zinc-800 m-3 border-gray-800"
    >
      <div className="heading text-xl border-b p-1 flex justify-between border-gray-500">
        {title}
        <span className="text-red-600 text-[.70rem]">{noteType}</span>
      </div>

      <div className="content pt-3 text-sm text-gray-300 px-1 line-clamp-2">
        {content}
      </div>

      <div className="bottom border-t border-gray-500 absolute flex px-4 py-2 bottom-2 gap-4">
        <div
          onClick={(e) => {
            e.stopPropagation()
            handleEdit()
          }}
          className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 hover:bg-blue-500/80 active:scale-95"
        >
          E
        </div>

        <div
          onClick={(e) => {
            e.stopPropagation()
            handleDelet()
          }}
          className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-full bg-red-500 hover:bg-red-500/80 active:scale-95"
        >
          D
        </div>
      </div>
    </div>
  )
}
