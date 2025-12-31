// backend/src/modules/admin/admin.service.js
import * as repo from "./admin.repository.js";

export async function listPending() {
  return repo.listPendingUsers();
}

export async function approve(scope, id_user, payload) {
  // ✅ ADMIN (no global) solo puede asignar su establecimiento como DEFAULT
  if (!scope.global) {
    if (Number(payload.default_establecimiento) !== Number(scope.fk_establecimiento)) {
      const err = new Error("No puedes asignar otro establecimiento como default");
      err.statusCode = 403;
      throw err;
    }
    // opcional: forzar que SOLO pueda incluir su propio establecimiento en tags
    // si quieres permitir varios pero solo dentro de su scope, acá no aplica porque scope es 1.
    // Si quieres bloquear, descomenta:
    /*
    const bad = payload.establecimientos.some((x) => Number(x) !== Number(scope.fk_establecimiento));
    if (bad) {
      const err = new Error("No puedes asignar establecimientos fuera de tu alcance");
      err.statusCode = 403;
      throw err;
    }
    */
  }

  const updated = await repo.approveUserWithEstablishments({
    id_user,
    fk_rol: payload.fk_rol,
    establecimientos: payload.establecimientos,
    default_establecimiento: payload.default_establecimiento,
  });

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
  // ✅ Si no es global, no permitas cambiar default a otro establecimiento
  if (!scope.global) {
    if (
      data.default_establecimiento &&
      Number(data.default_establecimiento) !== Number(scope.fk_establecimiento)
    ) {
      const err = new Error("No puedes asignar otro establecimiento como default");
      err.statusCode = 403;
      throw err;
    }
  }

  return repo.updateUserWithEstablishments(scope, id_user, data);
}

export async function getUserEstablishments(scope, id_user) {
  // Si quieres poner restricción por scope, aquí puedes validar contra users.fk_establecimiento
  // por ahora devolvemos la lista (solo admin/superadmin entra a este módulo)
  return repo.getUserEstablishmentsByUserId(id_user);
}
