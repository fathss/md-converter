import Title from "../components/Title"
import FileUploader from "../components/FileUploader"
import FileWorkspace from "../components/FileWorkspace"

function MainPage() {
  return (
    <>
      <div className="w-5xl flex flex-col items-center gap-8">
        <Title />
        <FileUploader />
        <FileWorkspace />
      </div>
    </>
  )
}

export default MainPage