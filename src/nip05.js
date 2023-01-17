const niceNip05 = (nip05) => {
    const [user, domain] = nip05.split('@');

    if (user === '_') {
        return domain;
    }

    return nip05;
}

export default niceNip05;