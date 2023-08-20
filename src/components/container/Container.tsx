import React from 'react';
import '../container/container.scss';
import Header from '../header/Header';
import { ProgressBar, Bottomsheet, Text, Button } from 'prixa-design-kit/dist';
import { closeSeamlessLogin } from '../../utils/constant';

interface ContainerProps {
  title?: string;
  subtitle?: string;
  percentage?: number;
  showAvatar?: boolean;
  showDownload?: boolean;
  showMenu?: boolean;
  showReset?: boolean;
  isDownloading?: boolean;
  setDownload?: (isDownloading: boolean) => void;
  editMode?: boolean;
  setEditMode?: (editMode: boolean) => void;
  deleteMode?: boolean;
  setDeleteMode?: (deleteMode: boolean) => void;
  setHandleReset?: (handleReset: boolean) => void;
  setHandleClose?: (handleClose: boolean) => void;
  handleClose?: boolean;
  content: any;
  countFamilyMember?: number;
}

const partnerBanner = `${process.env.REACT_APP_ASSET_URL}/illustration/onboarding.png`;

const Container = (props: ContainerProps): JSX.Element => {
  const [percentage, setPercentage] = React.useState(0);
  const pageWithoutHeader = ['/initiate', '/hospital', '/booking-summary'];
  const pageWithAdd = ['/family-member'];
  const pageWithEdit = ['/precondition-info', '/personal-information'];
  const pageWithDelete = ['/modify-family-member'];
  const pageWithReset = ['/filter'];

  const regexPageWithoutHeader = new RegExp(pageWithoutHeader.join('|'), 'i');

  /* eslint-disable */
  React.useEffect(() => {
    setPercentage(props.percentage || 0);
  }, [props.percentage]);
  /* eslint-enable */

  return (
    <React.Fragment>
      <FullHeader
        regexPageWithoutHeader={regexPageWithoutHeader}
        title={props.title}
        subtitle={props.subtitle}
        showMenu={props.showMenu}
        isDownloading={props.isDownloading}
        setDownload={props.setDownload}
        showAvatar={props.showAvatar}
        showDownload={props.showDownload}
      />
      <HeaderWithReset
        pageWithReset={pageWithReset}
        title={props.title}
        subtitle={props.subtitle}
        isDownloading={props.isDownloading}
        setDownload={props.setDownload}
        showReset={props.showReset}
        setHandleReset={props.setHandleReset}
      />
      <HeaderWithAddMode
        pageWithAdd={pageWithAdd}
        title={props.title}
        subtitle={props.subtitle}
        isDownloading={props.isDownloading}
        setDownload={props.setDownload}
        editMode={props.editMode}
        countFamilyMember={props.countFamilyMember}
      />
      <HeaderWithEditMode
        pageWithEdit={pageWithEdit}
        title={props.title}
        subtitle={props.subtitle}
        isDownloading={props.isDownloading}
        setDownload={props.setDownload}
        editMode={props.editMode}
        setEditMode={props.setEditMode}
      />
      <HeaderWithDeleteMode
        pageWithDelete={pageWithDelete}
        title={props.title}
        subtitle={props.subtitle}
        isDownloading={props.isDownloading}
        setDownload={props.setDownload}
        editMode={props.editMode}
        deleteMode={props.deleteMode}
        setDeleteMode={props.setDeleteMode}
      />
      <Percentage percentage={percentage} />
      <PageHeight
        regexPageWithoutHeader={regexPageWithoutHeader}
        content={props.content}
        setHandleClose={props.setHandleClose}
        handleClose={props.handleClose}
      />
    </React.Fragment>
  );
};

const FullHeader = ({
  regexPageWithoutHeader,
  title,
  subtitle,
  showMenu,
  showAvatar,
  showDownload,
  isDownloading,
  setDownload,
}: any): JSX.Element | null => {
  const isFullHeader = !regexPageWithoutHeader.test(window.location.pathname);

  return isFullHeader ? (
    <Header
      title={title}
      subtitle={subtitle}
      showMenu={showMenu}
      isDownloading={isDownloading}
      setDownload={setDownload}
      showAvatar={showAvatar}
      showDownload={showDownload}
    ></Header>
  ) : null;
};

const HeaderWithReset = ({
  pageWithReset,
  title,
  subtitle,
  showReset,
  setHandleReset,
  isDownloading,
  setDownload,
}: any) => {
  const isPageWithReset = pageWithReset.includes(window.location.pathname);

  return isPageWithReset ? (
    <Header
      title={title}
      subtitle={subtitle}
      showMenu={false}
      showAvatar={false}
      showDownload={false}
      isDownloading={isDownloading}
      setDownload={setDownload}
      showReset={showReset}
      setHandleReset={setHandleReset}
    ></Header>
  ) : null;
};

const HeaderWithAddMode = ({
  pageWithAdd,
  title,
  subtitle,
  editMode,
  countFamilyMember,
  isDownloading,
  setDownload,
}: any) => {
  const isPageWithAdd = pageWithAdd.includes(window.location.pathname);

  return isPageWithAdd ? (
    <Header
      title={title}
      subtitle={subtitle}
      showMenu={false}
      showAvatar={false}
      showDownload={false}
      isDownloading={isDownloading}
      setDownload={setDownload}
      editMode={editMode}
      changeMode="add"
      countFamilyMember={countFamilyMember}
    ></Header>
  ) : null;
};

const HeaderWithEditMode = ({
  pageWithEdit,
  title,
  subtitle,
  editMode,
  setEditMode,
  isDownloading,
  setDownload,
}: any) => {
  const isPageWithEdit = pageWithEdit.includes(window.location.pathname);

  return isPageWithEdit ? (
    <Header
      title={title}
      subtitle={subtitle}
      showMenu={false}
      showAvatar={false}
      showDownload={false}
      isDownloading={isDownloading}
      setDownload={setDownload}
      editMode={editMode}
      setEditMode={setEditMode}
    ></Header>
  ) : null;
};

const HeaderWithDeleteMode = ({
  pageWithDelete,
  title,
  subtitle,
  editMode,
  deleteMode,
  setDeleteMode,
  isDownloading,
  setDownload,
}: any) => {
  const isPageWithDelete = pageWithDelete.includes(window.location.pathname);

  return isPageWithDelete ? (
    <Header
      title={title}
      subtitle={subtitle}
      showMenu={false}
      showAvatar={false}
      showDownload={false}
      isDownloading={isDownloading}
      setDownload={setDownload}
      editMode={editMode}
      changeMode="delete"
      deleteMode={deleteMode}
      setDeleteMode={setDeleteMode}
    ></Header>
  ) : null;
};

const Percentage = ({ percentage }: any) => {
  return percentage ? <ProgressBar className="display-flex" progressBarSize={percentage}></ProgressBar> : null;
};

const closeContent = (): JSX.Element => {
  return (
    <div className="bottomsheet-content">
      <div className="main-content">
        <div className="image-content">
          <img loading="lazy" alt="Partner banner" src={partnerBanner} />
        </div>
        <div className="main-text">
          <Text scale="question">Anda akan disambungkan kembali ke Home.</Text>
        </div>
        <div className="sub-text">
          <Text scale="feedbackLink" className="text">
            Proses yang belum Anda selesaikan tidak akan disimpan dan perlu diulang kembali saat Anda terhubung kembali
            ke platform telekonsultasi. Apakah Anda ingin keluar dari platform telekonsultasi?
          </Text>
        </div>
      </div>
      <div className="button-full">
        <Button
          size="full"
          variant="primary"
          onClick={() => {
            closeSeamlessLogin();
          }}
        >
          Keluar dari telekonsultasi
        </Button>
      </div>
    </div>
  );
};

const PageHeight = ({ regexPageWithoutHeader, content, setHandleClose, handleClose }: any): JSX.Element => {
  return (
    <>
      <div className={!regexPageWithoutHeader.test(window.location.pathname) ? `prixa` : `prixa is-full-height`}>
        {content}
      </div>
      <Bottomsheet setShow={setHandleClose} show={handleClose} title="Keluar" content={closeContent()}></Bottomsheet>
    </>
  );
};

export default Container;
