import * as repo from "./admin.repository.js";

export async function listPending() {
  return repo.listPendingUsers();
}

export async function approve(id_user, payload) {
  const updated = await repo.approveUser({ id_user, ...payload });
  if (!updated) {
    const err = new Error("Usuario no encontrado");
    err.statusCode = 404;
    throw err;
  }
  return updated;
}

export async function disable(id_user) {
  const updated = await repo.disableUser(id_user);
  if (!updated) {
    const err = new Error("Usuario no encontrado");
    err.statusCode = 404;
    throw err;
  }
  return updated;
}
export async function listApproved(scope, filters) {
  return repo.listApprovedUsers(scope, filters);
}

export async function updateUser(scope, id_user, data) {
  // ADMIN no puede asignar otro establecimiento distinto al suyo
  if (!scope.global) {
    if (data.fk_establecimiento && data.fk_establecimiento !== scope.fk_establecimiento) {
      const err = new Error("No puedes asignar otro establecimiento");
      err.statusCode = 403;
      throw err;
    }
  }
  return repo.updateUserById(scope, id_user, data);
}
