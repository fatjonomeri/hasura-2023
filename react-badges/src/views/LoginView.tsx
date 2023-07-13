import React from "react";

import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Typography
} from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { removeLoadable } from "../state/with-loadable";
import { useAuth } from "../state/with-auth";
import CenteredLayout from "../layouts/CenteredLayout";

interface User {
  id: number;
  name: string;
  roles: string[];
  default: string;
  token: string;
}

// const users: User[] = [
//   {
//     id: 3,
//     name: "Darth Vaeder",
//     roles: ["backoffice"],
//     default: "backoffice",
//     token:
//       "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWRlZmF1bHQtcm9sZSI6ImJhY2tvZmZpY2UiLCJ4LWhhc3VyYS1hbGxvd2VkLXJvbGVzIjpbImJhY2tvZmZpY2UiXSwieC1oYXN1cmEtdGVuYW50LWlkIjoiMyJ9fQ.9kX3MV-CWMwqQL4wdC8bkQYvjlD7HBOhlcmo8gO7GsI"
//   },
//   {
//     id: 1,
//     name: "Luke Skywalker",
//     roles: ["backoffice", "manager"],
//     default: "manager",
//     token:
//       "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWRlZmF1bHQtcm9sZSI6Im1hbmFnZXIiLCJ4LWhhc3VyYS1hbGxvd2VkLXJvbGVzIjpbImJhY2tvZmZpY2UiLCJtYW5hZ2VyIl0sIngtaGFzdXJhLXRlbmFudC1pZCI6IjEifX0.rNnZX4QEA0BlGpqzZd203Cq7WqP1HYlksjlGLtQOZEM"
//   },
//   {
//     id: 8,
//     name: "Chewbacca",
//     roles: ["engineer"],
//     default: "engineer",
//     token:
//       "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWRlZmF1bHQtcm9sZSI6ImVuZ2luZWVyIiwieC1oYXN1cmEtYWxsb3dlZC1yb2xlcyI6WyJlbmdpbmVlciJdLCJ4LWhhc3VyYS10ZW5hbnQtaWQiOiI4In19.xXT-Vpj0E5de87naf-Fv46oUZRhrMQ4x5uoxbmdPqH4"
//   },

//   {
//     id: 6,
//     name: "Leia Organa",
//     roles: ["backoffice", "manager", "engineer"],
//     default: "backoffice",
//     token:
//       "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWRlZmF1bHQtcm9sZSI6ImJhY2tvZmZpY2UiLCJ4LWhhc3VyYS1hbGxvd2VkLXJvbGVzIjpbImJhY2tvZmZpY2UiLCJtYW5hZ2VyIiwiZW5naW5lZXIiXSwieC1oYXN1cmEtdGVuYW50LWlkIjoiNiJ9fQ.YWB150BMy3LmpZEiuoQGBblVFqMLeVgIQXODc7i0u5M"
//   }
// ];

const users: User[] = [
  {
    id: 3,
    name: "Darth Vaeder",
    roles: ["backoffice"],
    default: "backoffice",
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWRlZmF1bHQtcm9sZSI6ImJhY2tvZmZpY2UiLCJ4LWhhc3VyYS1hbGxvd2VkLXJvbGVzIjpbImJhY2tvZmZpY2UiXSwieC1oYXN1cmEtdGVuYW50LWlkIjoiMyJ9fQ.9kX3MV-CWMwqQL4wdC8bkQYvjlD7HBOhlcmo8gO7GsI"
  },
  {
    id: 1,
    name: "Luke Skywalker",
    roles: ["backoffice", "engineer"],
    default: "engineer",
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWRlZmF1bHQtcm9sZSI6ImVuZ2luZWVyIiwieC1oYXN1cmEtYWxsb3dlZC1yb2xlcyI6WyJlbmdpbmVlciIsImJhY2tvZmZpY2UiXSwieC1oYXN1cmEtdGVuYW50LWlkIjoiMSJ9fQ.GAaecB0Tn6NlwY9Fq3yzlp1_BKQj6QVyx4MG6ftFDZU"
  },
  {
    id: 1,
    name: "Luke Skywalker",
    roles: ["engineer", "backoffice"],
    default: "engineer",
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWRlZmF1bHQtcm9sZSI6ImVuZ2luZWVyIiwieC1oYXN1cmEtYWxsb3dlZC1yb2xlcyI6WyJlbmdpbmVlciIsImJhY2tvZmZpY2UiXSwieC1oYXN1cmEtdGVuYW50LWlkIjoiMSJ9fQ.varTWrt4TLutDWD0WfdoyxFAz96DOVrpo5vMB86uZLo"
  },
  {
    id: 6,
    name: "Leia Organa",
    roles: ["backoffice", "manager", "engineer"],
    default: "backoffice",
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwczovL2hhc3VyYS5pby9qd3QvY2xhaW1zIjp7IngtaGFzdXJhLWRlZmF1bHQtcm9sZSI6ImJhY2tvZmZpY2UiLCJ4LWhhc3VyYS1hbGxvd2VkLXJvbGVzIjpbImJhY2tvZmZpY2UiLCJtYW5hZ2VyIiwiZW5naW5lZXIiXSwieC1oYXN1cmEtdGVuYW50LWlkIjoiNiJ9fQ.YWB150BMy3LmpZEiuoQGBblVFqMLeVgIQXODc7i0u5M"
  }
];

const LoginView = () => {
  const { login } = useAuth();
  return (
    <CenteredLayout>
      <Typography variant="h1">Badges App</Typography>
      <List>
        {users.map((user) => (
          <ListItem key={user.id}>
            <ListItemButton onClick={() => login(user.token)}>
              <ListItemText
                primary={user.name}
                secondary={user.roles.join(", ")}
              />
              <ListItemIcon sx={{ ml: 2 }}>
                <ChevronRightIcon />
              </ListItemIcon>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </CenteredLayout>
  );
};

export default removeLoadable(LoginView);
