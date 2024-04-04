/* eslint-disable-next-line */
export interface ComponentLibProps {}

export function ComponentLib(props: ComponentLibProps) {
  return (
    <div>
      <style jsx>{`
        div {
          color: pink;
        }
      `}</style>
      <h1>Welcome to ComponentLib!</h1>
    </div>
  );
}

export default ComponentLib;
