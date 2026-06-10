export const Button = (props: {
  text: string;
  visible: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      onclick={props.onClick}
      class="rounded-full px-2 py-1 text-center"
      style={`visibility: ${props.visible ? "visible" : "hidden"}`}
    >
      {props.text}
    </button>
  );
};

export default Button;
