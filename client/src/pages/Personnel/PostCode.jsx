import NewWindow from 'react-new-window';
import DaumPostcode from 'react-daum-postcode';

const PostCode = ({ onClose, setAddress, setAddressDetail }) => {
  const handlePostCode = data => {
    let fullAddr = data.address;
    let extraAddr = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddr += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddr +=
          extraAddr !== '' ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddr += extraAddr !== '' ? ` (${extraAddr})` : '';
    }
    setAddress(data.zonecode);
    setAddressDetail(fullAddr);
    onClose();
  };

  const postCodeStyle = {
    display: 'block',
    position: 'absolute',
    top: '10%',
    width: '600px',
    height: '600px',
    padding: '7px',
  };

  return (
    <NewWindow
      title='주소찾기'
      features={{ width: 600, height: 600 }}
      onUnload={() => {
        onClose();
      }}>
      <DaumPostcode style={postCodeStyle} onComplete={handlePostCode} />
    </NewWindow>
  );
};

export default PostCode;
