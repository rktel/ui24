import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import { admin } from './data';

Meteor.methods({
    'users.setAdmin': () => {
        if (!Meteor.users.findOne({ username: admin.username })) {
            let id;
            id = Accounts.createUser({
                username: admin.username,
                email: admin.email,
                password: admin.password,
                profile: { name: admin.name }
            });
            if (Meteor.roleAssignment.find({ 'user._id': id }).count() === 0) {
                admin.roles.forEach(function (role) {
                    Roles.createRole(role, { unlessExists: true });
                });
                Roles.addUsersToRoles(id, admin.roles);
            }
        }
    }
})






