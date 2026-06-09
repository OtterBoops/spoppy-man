export const Header = (props: {
  displayName?: string;
  profilePicture?: string;
}) => {
  return (
    <header class="flex flex-col items-center gap-4 p-4">
      <h1 class="text-3xl font-bold">Sample Header</h1>
      <p class="text-lg">{props.displayName || "Guest"}</p>
      <img src={props.profilePicture || ""} alt="Profile Picture" />
    </header>
  );
};

export default Header;
