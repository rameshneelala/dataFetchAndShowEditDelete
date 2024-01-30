import React, { useEffect, useReducer, useState } from "react";

const reducer = (state, action) => {
  if (action.type === "UPDATE_DATA") {
    return {
      ...state,
      usersData: action.payload,
    };
  }
  if (action.type === "LOADING") {
    return {
      ...state,
      isLoading: action.payload,
    };
  }
  if (action.type === "DELETE_USER") {
    const newUsers = state.usersData.filter(
      (eachUser) => eachUser.id !== action.payload
    );
    return {
      ...state,
      usersData: newUsers,
    };
  }
  if (action.type === "ONCLICK_EDIT") {
    return {
      ...state,
      isEditing: action.payload,
    };
  }
  if (action.type === "TO_UPDATE_USER") {
    const newUsers = state.usersData.map((eachUser) => {
      if (eachUser.id === action.payload.id) {
        return {
          id: action.payload.id,
          name: action.payload.name,
          email: action.payload.email,
        };
      } else {
        return eachUser;
      }
    });
    return {
      ...state,
      usersData: newUsers,
    };
  }
  return state;
};

const Final = () => {
  const fetchData = async (URL) => {
    dispatch({
      type: "LOADING",
      payload: true,
    });
    try {
      const response = await fetch(URL);
      const data = await response.json();
      console.log(data);
      dispatch({
        type: "LOADING",
        payload: false,
      });

      dispatch({
        type: "UPDATE_DATA",
        payload: data,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData("https://jsonplaceholder.typicode.com/users");
  }, []);

  const initialState = {
    usersData: [],
    isLoading: false,
    isEditing: { status: false, id: "", name: "", email: "" },
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const updateData = (id, name, email) => {
    dispatch({
      type: "TO_UPDATE_USER",
      payload: { id, name, email },
    });
    dispatch({
      type: "ONCLICK_EDIT",
      payload: { status: false, id: "", name: "", email: "" },
    });
  };

  if (state.isLoading) {
    return (
      <div>
        <h3>Loading...</h3>
      </div>
    );
  }

  return (
    <div>
      <h1>Users Information</h1>
      {state.isEditing?.status && (
        <EditInformation
          id={state.isEditing.id}
          comingName={state.isEditing.name}
          comingEmail={state.isEditing.email}
          updateData={updateData}
        />
      )}
      {state.usersData.map((eachUser) => {
        const { id, name, email } = eachUser;
        return (
          <div key={id} style={{ backgroundColor: "lightblue" }}>
            <h1>{name}</h1>
            <p>{email}</p>
            <button
              onClick={() =>
                dispatch({
                  type: "DELETE_USER",
                  payload: id,
                })
              }
            >
              Delete
            </button>
            <button
              onClick={() =>
                dispatch({
                  type: "ONCLICK_EDIT",
                  payload: { status: true, id: id, name: name, email: email },
                })
              }
            >
              Edit
            </button>
          </div>
        );
      })}
    </div>
  );
};

const EditInformation = ({ id, comingName, comingEmail, updateData }) => {
  const [name, setName] = useState(comingName || "");
  const [email, setEmail] = useState(comingEmail || "");

  return (
    <div>
      <input
        type="text"
        name="name"
        id="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        name="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={() => updateData(id, name, email)}>Update</button>
    </div>
  );
};

export default Final;
