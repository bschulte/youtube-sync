import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  Submit,
} from "@redwoodjs/forms";

const formatDatetime = (value) => {
  if (value) {
    return value.replace(/:\d{2}\.\d{3}\w/, "");
  }
};

const RoomForm = (props) => {
  const onSubmit = (data) => {
    props.onSave(data, props?.room?.id);
  };

  return (
    <div className="rw-form-wrapper">
      <Form onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <Label
          name="videoUrl"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Video url
        </Label>
        <TextField
          name="videoUrl"
          defaultValue={props.room?.videoUrl}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="videoUrl" className="rw-field-error" />

        <Label
          name="currentTime"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Current time
        </Label>
        <TextField
          name="currentTime"
          defaultValue={props.room?.currentTime}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="currentTime" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  );
};

export default RoomForm;
