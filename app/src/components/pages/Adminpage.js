import React, { useState, useEffect } from "react";

function Adminpage() {
    const [users, setUsers] = useState([]);
    const [newNewAuthorisation, newAuthorisation] = useState("");

    const [showSuccessMessage, setShowSuccessMessageMessage] = useState(false);
    const [newsletterDate, setNewsletterDate] = useState("");
    const [newNewsletterDate, setNewNewsletterDate] = useState("");

    const [organisations, setOrganisations] = useState([]);
    const [editedOrganisation, setEditedOrganisation] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);

    const [editors, setEditors] = useState([]);
    const [tags, setTags] = useState([]);
    const [userId, setUserId] = useState("");
    const [tagId, setTagId] = useState("");
    const [count, setCount] = useState(0);



    useEffect(() => {
        try {
            Promise.all([
                fetch("http://unn-w20020581.newnumyspace.co.uk/teamAssessment/api/getUsers"),
                fetch("http://unn-w20020581.newnumyspace.co.uk/teamAssessment/api/getOrganisations"),
                fetch("http://unn-w20020581.newnumyspace.co.uk/teamAssessment/api/getNextNewsletterDate")
            ])
                .then(
                    ([usersResponse, organisationsResponse, newsletterDateResponse]) =>
                        Promise.all([
                            usersResponse.json(),
                            organisationsResponse.json(),
                            newsletterDateResponse.json(),
                        ])
                )
                .then(([usersData, organisationsData, newsganisationsDatletterDateData]) => {
                    setUsers(JSON.parse(usersData));
                    setOrganisations(JSON.parse(organisationsData));
                    setNewsletterDate(JSON.parse(newsganisationsDatletterDateData)[0].date);
                })
                .catch((error) => console.error("Error fetching data:", error));
        } catch (error) {
            console.error("Error in useEffect:", error);
        }
    }, []);

    useEffect(() => {
        async function fetchEditorsAndTags() {
            try {
                const [editorsResponse, tagsResponse] = await Promise.all([
                    fetch("http://unn-w20020581.newnumyspace.co.uk/teamAssessment/api/getUsers"),
                    fetch("http://unn-w20020581.newnumyspace.co.uk/teamAssessment/api/getTag"),
                ]);
                const [editorsData, tagsData] = await Promise.all([
                    editorsResponse.json(),
                    tagsResponse.json(),
                ]);
                setEditors(JSON.parse(editorsData));
                setTags(JSON.parse(tagsData));
            } catch (error) {
                console.error("Error in fetchEditorsAndTags:", error);
            }
        }

        fetchEditorsAndTags();
    }, []);

    async function handleSubmit(event) {
        event.preventDefault();
        try {
            const response = await fetch("http://unn-w20020581.newnumyspace.co.uk/teamAssessment/api/getStats", {
                method: "POST",
                    headers: new Headers({ "Authorization": "Bearer " + localStorage.getItem('token'), "Content-Type": "application/json" }),
                body: JSON.stringify({
                    userId: userId,
                    tagId: tagId,
                }),
            });
            const data = await response.json();
            console.log(data);
            setCount(data.replace(/[^0-9]/g, ""));
        } catch (error) {
            console.error("Error in handleSubmit:", error);
        }
    }

    const handleUpdateUpdateUser = (userId, newData) => {
        console.log("Updating user: ", userId, newData);

        fetch("http://unn-w20020581.newnumyspace.co.uk/teamAssessment/api/updateUser", {
            method: "POST",
                headers: new Headers({ "Authorization": "Bearer " + localStorage.getItem('token'), "Content-Type": "application/json" }),
            body: JSON.stringify({
                userId: userId,
                authorisation: newData.authorisation,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Update successful: ", data);

                setUsers((prevEditors) =>
                    prevEditors.map((user) => {
                        if (user.user_id === userId) {
                            return {
                                ...user,
                                authorisation: data.authorisation,
                            };
                        } else {
                            return user;
                        }
                    })
                );

                // Show success message for 2 seconds
                setShowSuccessMessageMessage(true);
                setTimeout(() => {
                    setShowSuccessMessageMessage(false);
                }, 500);
            })
            .catch((error) => {
                console.error("Error updating user:", error);
            });
    };

    const handleDropdownChangeUpdateUser = (e, userId) => {
        const newNewAuthorisationValue = e.target.value;
        newAuthorisation(newNewAuthorisationValue);
        setUsers((prevUsers) =>
            prevUsers.map((user) => {
                if (user.user_id === userId) {
                    return {
                        ...user,
                        authorisation: newNewAuthorisationValue,
                    };
                } else {
                    return user;
                }
            })
        );
    };

    const handleMakeChangeUpdateUser = (userId) => {
        const userToUpdate = users.find((user) => user.user_id === userId);
        handleUpdateUpdateUser(userId, {
            authorisation: userToUpdate.authorisation,
        });
        newAuthorisation("");
    };

    const handleUpdateNewsletterDate = (newNewsletterDate) => {
        fetch("http://unn-w20020581.newnumyspace.co.uk/teamAssessment/api/updateNextNewsletterDate", {
            method: "POST",
                headers: new Headers({ "Authorization": "Bearer " + localStorage.getItem('token'), "Content-Type": "application/json" }),
            body: JSON.stringify({
                date: newNewsletterDate,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Update successful: ", data);
                setNewsletterDate(newNewsletterDate);
                setNewNewsletterDate("");
                setShowSuccessMessageMessage(true);
                setTimeout(() => {
                    setShowSuccessMessageMessage(false);
                }, 500);
            })
            .catch((error) => {
                console.error("Error updating newsletter date:", error);
            });
    };

    const [newOrganisationName, setNewOrganisationName] = useState("");
    const [newOrganisationDomain, setNewOrganisationDomain] = useState("");



    const handleCreate = async () => {
        const response = await fetch("http://unn-w20020581.newnumyspace.co.uk/teamAssessment/api/createOrganisation", {
            method: "POST",
            headers: new Headers({ "Authorization": "Bearer " + localStorage.getItem('token'), "Content-Type": "application/json" }),
            body: JSON.stringify({
                organisation_name: newOrganisationName,
                organisation_domain: newOrganisationDomain,
            }),
        });
        const data = await response.json();
        setOrganisations([...organisations, data]);
        setNewOrganisationName("");
        setNewOrganisationDomain("");
        setShowCreateForm(false);
        window.location.reload(); // reload the page
    };

    const handleEdit = (org) => {
        setEditedOrganisation(org);
    };

    const handleSave = () => {
        fetch("http://unn-w20020581.newnumyspace.co.uk/teamAssessment/api/updateOrganisation", {
            method: "POST",
                headers: new Headers({ "Authorization": "Bearer " + localStorage.getItem('token'), "Content-Type": "application/json" }),
            body: JSON.stringify(editedOrganisation),
        })
            .then((response) => response.json())
            .then((data) =>
                console.log("Update success for org:", editedOrganisation)
            );
        setShowSuccessMessageMessage(true);
        setTimeout(() => {
            setShowSuccessMessageMessage(false);
        }, 500).catch((error) => {
            console.error("Error updating organisation:", editedOrganisation, error);
            // log the error message to the console
            console.log("Fetch error message:", error.message);
        });
    };

    const handleCancel = () => {
        setEditedOrganisation(null);
    };

    const handleDelete = async (org) => {
        try {
            const response = await fetch(`http://unn-w20020581.newnumyspace.co.uk/teamAssessment/api/deleteOrganisation`, {
                method: "DELETE",
                headers: new Headers({ "Authorization": "Bearer " + localStorage.getItem('token'), "Content-Type": "application/json" }),
                body: JSON.stringify({ organisation_id: org.organisation_id }),
            });

            if (response.ok) {
                setOrganisations(
                    organisations.filter((o) => o.organisation_id !== org.organisation_id)
                );
            } else {
                console.error("Failed to delete organisation");
            }
        } catch (error) {
            console.error("Failed to delete organisation", error);
        }
    };

    return (
        <div>
            {showSuccessMessage && <p style={{ color: "green" }}>Success!</p>}
            <h1 style={{ marginBottom: "20px" }}>List of Users</h1>
            <table style={{ borderCollapse: "collapse", width: "100%" }}>
                <thead>
                <tr>
                    <th style={{ border: "1px solid black", padding: "5px" }}>
                        First Name
                    </th>
                    <th style={{ border: "1px solid black", padding: "5px" }}>
                        Last Name
                    </th>
                    <th style={{ border: "1px solid black", padding: "5px" }}>Role</th>
                    <th style={{ border: "1px solid black", padding: "5px" }}>
                        Update
                    </th>
                </tr>
                </thead>
                <tbody>
                {users.map((user) => (
                    <tr key={user.user_id}>
                        <td style={{ border: "1px solid black", padding: "5px" }}>
                            {user.first_name}
                        </td>
                        <td style={{ border: "1px solid black", padding: "5px" }}>
                            {user.last_name}
                        </td>
                        <td style={{ border: "1px solid black", padding: "5px" }}>
                            <select
                                value={user.authorisation}
                                onChange={(e) =>
                                    handleDropdownChangeUpdateUser(e, user.user_id)
                                }
                                style={{ width: "100%" }}
                            >
                                <option value="2">Editor</option>
                                <option value="3">Admin</option>
                                <option value="1">Partner</option>
                                <option value="0">Subscriber</option>
                            </select>
                        </td>
                        <td style={{ border: "1px solid black", padding: "5px" }}>
                            <button
                                style={{
                                    backgroundColor: "green",
                                    color: "white",
                                    marginTop: "2px",
                                    marginBottom: "2px",
                                    padding: "2px 2px",
                                    border: "none",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                }}
                                onClick={() => handleMakeChangeUpdateUser(user.user_id)}
                                disabled={!newNewAuthorisation}
                            >
                                Update
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                style={{
                    backgroundColor: showCreateForm ? "red" : "green",
                    color: "white",
                    marginTop: "20px",
                    marginBottom: "20px",
                    padding: "2x 2px",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                }}
            >
                {showCreateForm ? "Cancel" : "Create New Organisation"}
            </button>
            {showCreateForm && (
                <div style={{ marginBottom: "20px" }}>
                    <input
                        type="text"
                        placeholder="Name"
                        value={newOrganisationName}
                        onChange={(e) => setNewOrganisationName(e.target.value)}
                        style={{
                            marginRight: "10px",
                            padding: "10px",
                            border: "none",
                            borderRadius: "5px",
                        }}
                    />
                    <input
                        type="text"
                        placeholder="Domain"
                        value={newOrganisationDomain}
                        onChange={(e) => setNewOrganisationDomain(e.target.value)}
                        style={{
                            marginRight: "10px",
                            padding: "10px",
                            border: "none",
                            borderRadius: "5px",
                        }}
                    />
                    <button
                        onClick={handleCreate}
                        style={{
                            backgroundColor: "green",
                            color: "white",
                            marginTop: "20px",
                            marginBottom: "20px",
                            padding: "10px 20px",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                        }}
                    >
                        Create
                    </button>{" "}
                </div>
            )}
            <h1 style={{ textAlign: "left" }}>List of Organisations</h1>
            <table
                style={{ borderCollapse: "collapse", marginTop: "20px", width: "100%" }}
            >
                <thead>
                <tr>
                    <th
                        style={{
                            border: "1px solid black",
                            padding: "5px",
                            textAlign: "left",
                        }}
                    >
                        ID
                    </th>
                    <th
                        style={{
                            border: "1px solid black",
                            padding: "5px",
                            textAlign: "left",
                        }}
                    >
                        Name
                    </th>
                    <th
                        style={{
                            border: "1px solid black",
                            padding: "5px",
                            textAlign: "left",
                        }}
                    >
                        Domain
                    </th>
                    <th
                        style={{
                            border: "1px solid black",
                            padding: "5px",
                            textAlign: "center",
                        }}
                    >
                        Edit
                    </th>
                    <th
                        style={{
                            border: "1px solid black",
                            padding: "5px",
                            textAlign: "center",
                        }}
                    >
                        Delete
                    </th>
                </tr>
                </thead>
                <tbody>
                {organisations.map((org) => (
                    <tr key={org.organisation_id}>
                        <td
                            style={{
                                border: "1px solid black",
                                padding: "5px",
                                textAlign: "left",
                            }}
                        >
                            {org.organisation_id}
                        </td>
                        <td
                            style={{
                                border: "1px solid black",
                                padding: "5px",
                                textAlign: "left",
                            }}
                        >
                            {editedOrganisation?.organisation_id === org.organisation_id ? (
                                <input
                                    type="text"
                                    value={editedOrganisation.organisation_name}
                                    onChange={(e) =>
                                        setEditedOrganisation({
                                            ...editedOrganisation,
                                            organisation_name: e.target.value,
                                        })
                                    }
                                    style={{ width: "100%", border: "1px solid black" }}
                                />
                            ) : (
                                org.organisation_name
                            )}
                        </td>
                        <td
                            style={{
                                border: "1px solid black",
                                padding: "5px",
                                textAlign: "left",
                            }}
                        >
                            {editedOrganisation?.organisation_id === org.organisation_id ? (
                                <input
                                    type="text"
                                    value={editedOrganisation.organisation_domain}
                                    onChange={(e) =>
                                        setEditedOrganisation({
                                            ...editedOrganisation,
                                            organisation_domain: e.target.value,
                                        })
                                    }
                                    style={{ width: "100%", border: "1px solid black" }}
                                />
                            ) : (
                                org.organisation_domain
                            )}
                        </td>
                        <td
                            style={{
                                border: "1px solid black",
                                padding: "5px",
                                textAlign: "center",
                            }}
                        >
                            {editedOrganisation?.organisation_id === org.organisation_id ? (
                                <div>
                                    <button
                                        onClick={handleSave}
                                        style={{
                                            backgroundColor: "green",
                                            color: "white",
                                            marginTop: "20px",
                                            marginBottom: "20px",
                                            padding: "10px 20px",
                                            border: "none",
                                            borderRadius: "5px",
                                            cursor: "pointer",
                                        }}
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        style={{
                                            backgroundColor: "grey",
                                            color: "white",
                                            marginTop: "20px",
                                            marginBottom: "20px",
                                            padding: "10px 20px",
                                            border: "none",
                                            borderRadius: "5px",
                                            cursor: "pointer",
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => handleEdit(org)}
                                    style={{
                                        backgroundColor: "green",
                                        color: "white",
                                        marginTop: "2px",
                                        marginBottom: "2px",
                                        padding: "2px 2px",
                                        border: "none",
                                        borderRadius: "5px",
                                        cursor: "pointer",
                                    }}
                                >
                                    Edit
                                </button>
                            )}
                        </td>
                        <td
                            style={{
                                border: "1px solid black",
                                padding: "5px",
                                textAlign: "center",
                            }}
                        >
                            <button
                                onClick={() => handleDelete(org)}
                                style={{
                                    backgroundColor: "red",
                                    color: "white",
                                    marginTop: "2px",
                                    marginBottom: "2px",
                                    padding: "2px 2px",
                                    border: "none",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                }}
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div>
                <div style={{ marginBottom: "20px" }}>
                    <h1 style={{ fontSize: "28px" }}>Next Newsletter Date</h1>
                    <input
                        type="date"
                        defaultValue={newsletterDate.split("-").reverse().join("-")}
                        onChange={(e) =>
                            setNewNewsletterDate(
                                e.target.value.split("-").reverse().join("-")
                            )
                        }
                        style={{ fontSize: "18px", padding: "8px", borderRadius: "4px" }}
                    />
                    <button
                        onClick={() => handleUpdateNewsletterDate(newNewsletterDate)}
                        style={{
                            backgroundColor: "green",
                            color: "white",
                            marginTop: "20px",
                            marginBottom: "20px",
                            padding: "10px 20px",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                        }}
                    >
                        Update
                    </button>
                </div>
                <h1 style={{ fontSize: "28px" }}>Contribution Stats</h1>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: "10px" }}>
                        <label htmlFor="userId" style={{ fontSize: "18px" }}>
                            Filter By User:
                        </label>
                        <select
                            id="userId"
                            value={userId}
                            onChange={(event) => setUserId(event.target.value)}
                            style={{
                                fontSize: "18px",
                                padding: "8px",
                                borderRadius: "4px",
                                marginLeft: "10px",
                            }}
                        >
                            <option value="">Select User ID</option>
                            {editors.map((editor) => (
                                <option key={editor.user_id} value={editor.user_id}>
                                    {editor.first_name}  {editor.last_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div style={{ marginBottom: "10px" }}>
                        <label htmlFor="tagId" style={{ fontSize: "18px" }}>
                            Filter By Tag:
                        </label>
                        <select
                            id="tagId"
                            value={tagId}
                            onChange={(event) => setTagId(event.target.value)}
                            style={{
                                fontSize: "18px",
                                padding: "8px",
                                borderRadius: "4px",
                                marginLeft: "10px",
                            }}
                        >
                            <option value="">Select Tag ID</option>
                            {tags.map((tag) => (
                                <option key={tag.tag_id} value={tag.tag_id}>
                                    {tag.tag_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button
                        type="submit"
                        style={{
                            backgroundColor: "green",
                            color: "white",
                            marginTop: "20px",
                            marginBottom: "20px",
                            padding: "10px 20px",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                        }}
                    >
                       Apply Filters
                    </button>
                </form>
                <h2 style={{ fontSize: "24px" }}>Count of Contributions: {count}</h2>
            </div>
        </div>
    );
}

export default Adminpage;
