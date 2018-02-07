{
    let s='bbb_bb_b';
    let a1=/b+/g;
    let a2=/b+/y;

    console.log('one',a1.exec(s),a2.exec(s));
    console.log('two',a1.exec(s),a2.exec(s));
}