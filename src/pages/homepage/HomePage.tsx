import { WrenchScrewdriverIcon } from "@heroicons/react/16/solid"
import { InfoLanding } from "../../components/InfoLanding"

const HomePage = () => {

  return (
    <>
      <InfoLanding
        icon={<WrenchScrewdriverIcon />}
        title={"Page Under Development"}
        description={"I'm working hard to bring you new features. This page will be available soon."}
        theme={"warning"}
      />
    </>
  )
}

export default HomePage