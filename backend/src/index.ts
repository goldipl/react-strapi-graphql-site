import type { Core } from '@strapi/strapi';

/**
 * Read-only actions the public (unauthenticated) role needs so the
 * frontend can query reviews, categories and their media over GraphQL.
 */
const PUBLIC_ACTIONS = [
  'api::review.review.find',
  'api::review.review.findOne',
  'api::category.category.find',
  'api::category.category.findOne',
  'plugin::upload.content-api.find',
  'plugin::upload.content-api.findOne',
];

const grantPublicPermissions = async (strapi: Core.Strapi) => {
  const publicRole = await strapi.db
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: 'public' } });

  if (!publicRole) return;

  const existing = await strapi.db
    .query('plugin::users-permissions.permission')
    .findMany({ where: { role: publicRole.id, action: { $in: PUBLIC_ACTIONS } } });

  const granted = new Set(existing.map((permission) => permission.action));
  const missing = PUBLIC_ACTIONS.filter((action) => !granted.has(action));

  await Promise.all(
    missing.map((action) =>
      strapi.db
        .query('plugin::users-permissions.permission')
        .create({ data: { action, role: publicRole.id } }),
    ),
  );

  if (missing.length > 0) {
    strapi.log.info(`Granted public permissions: ${missing.join(', ')}`);
  }
};

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await grantPublicPermissions(strapi);
  },
};
