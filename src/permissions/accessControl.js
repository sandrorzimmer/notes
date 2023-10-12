import { AccessControl } from 'accesscontrol';

const ac = new AccessControl();

ac.grant('user')
    .createOwn('note')
    .readAny('note')
    .updateOwn('note')
    .deleteOwn('note');

ac.grant('admin')
    .extend('user')
    .readAny('note')
    .updateAny('note')
    .deleteAny('note');

ac.grant('user')
    .createOwn('tag')
    .readAny('tag')
    .updateOwn('tag')
    .deleteOwn('tag');

ac.grant('admin')
    .extend('user')
    .readAny('tag')
    .updateAny('tag')
    .deleteAny('tag');

ac.grant('user')
    .readOwn('user')
    .updateOwn('user', ['name', 'password']);

ac.grant('admin')
    .extend('user')
    .createAny('user')
    .readAny('user')
    .updateAny('user')
    .deleteAny('user');

export default ac;
