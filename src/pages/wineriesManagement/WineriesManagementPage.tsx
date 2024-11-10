import { InfoLanding } from '../../components/InfoLanding'
import { WrenchScrewdriverIcon } from '@heroicons/react/16/solid'

const WineriesManagementPage = () => {
  return (
    <InfoLanding
      icon={<WrenchScrewdriverIcon />}
      title={"Page Under Development"}
      description={"I'm working hard to bring you new features. This page will be available soon."}
      theme={"warning"}
    />
  )
}

export default WineriesManagementPage